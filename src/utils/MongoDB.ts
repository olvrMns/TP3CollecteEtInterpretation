import { 
    connect, 
    Schema, 
    createConnection, 
    Model, 
    model, 
    Mongoose, 
    Collection, 
    Connection, 
    Types
} from 'mongoose';
import { User } from '../interfaces/user.interface';
import { Product } from '../interfaces/product.interface';
import { LOGGER } from './log/winstonLogger';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

export class MongoDBInquisitor {

    private url: string;
    private dbName: string | undefined;
    private mongooseInstance: Mongoose | undefined;

    private constructor(url: string) {
        this.url = url;
        this.dbName = undefined;
        this.mongooseInstance = undefined;
    }

    public static init(url: string): MongoDBInquisitor {
        return new MongoDBInquisitor(url);
    }

    private async execute(callback: () => Promise<void>): Promise<void> {
        try {
            this.mongooseInstance = await connect(this.url);
            this.dbName = this.mongooseInstance.connection.db.databaseName;
            LOGGER.log('infoMDB' ,`Connection to MongoDB Cluster [DB:${this.dbName}] successful...`);
            await callback();
            await this.closeConnection();
        } catch(ex: unknown) {
            LOGGER.error(String(ex));
        } finally {
            await this.closeConnection();
        }
    }
    
    public async closeConnection(): Promise<void> {
        if (this.mongooseInstance) {
            await this.mongooseInstance?.connection.close();
            LOGGER.log('infoMDB', `Connection to MongoDB Cluster [DB:${this.dbName}] closed...`);
            this.mongooseInstance = undefined;
        }
    }

    public async createCollection(collectionName: string, schema: Schema): Promise<void> {
        await this.execute(async () => {
            let model: any;
            model = this.mongooseInstance?.model(collectionName, schema);
            await model.createCollection();
        });
    }

    public async collectionExists(collectionName: string): Promise<boolean> {
        let res: boolean = false;
        await this.execute(async () => {
            let collectionNames: string[] = [];
            let collections: any = await this.mongooseInstance?.connection.db.listCollections().toArray();
            for (let elem = 0; elem < collections.length; elem++) collectionNames.push(collections[elem].name);
            res = collectionNames.includes(collectionName);
        });
        return res;
    }

    public async insertAny(collectionName: string, objects: any[]): Promise<void> {
        await this.execute(async () => {
            let collection: Collection | undefined = this.mongooseInstance?.connection.collection(collectionName);
            for (let elem = 0; elem < objects.length; elem++) await collection?.insertOne(objects[elem]);
        });
    }

}

const createAndInsert = async (environment_url: string, params: { collectionName: string, schema: Schema, objects: any[] }[]) => {
    let instance: MongoDBInquisitor = MongoDBInquisitor.init(environment_url);
    for (let elem = 0; elem < params.length; elem++) {
        if (!(await instance.collectionExists(params[elem].collectionName))) {
            await instance.createCollection(params[elem].collectionName, params[elem].schema);
            await instance.insertAny(params[elem].collectionName, params[elem].objects);
        }
    }
}

export const setMongoDBCluster = async (...environments_url: string[]) => {
    let userSchema: Schema = new Schema<User>();
    let productSchema: Schema = new Schema<Product>();
    let products: Product[] = await ProductService.getProducts();
    let users: User[] = await UserService.getUsers();
    for (let elem = 0; elem < environments_url.length; elem++) {
        await createAndInsert(environments_url[elem], [{collectionName: "users", schema: userSchema, objects: users}]);
        await createAndInsert(environments_url[elem], [{collectionName: "products", schema: productSchema, objects: products}]);
    }
}