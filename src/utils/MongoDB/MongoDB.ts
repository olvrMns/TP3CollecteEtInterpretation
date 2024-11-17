import {
    Collection,
    connect,
    Mongoose,
    Schema
} from 'mongoose';
import { Product } from '../../interfaces/product.interface';
import { User } from '../../interfaces/user.interface';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { LOGGER } from '../log/winstonLogger';
import { Schemas, SchemasName } from './schemas';

export interface CollectionExistsResponse {
    exists: boolean;
    count: number | undefined;
}

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

    private async initConnection(): Promise<void> {
        this.mongooseInstance = await connect(this.url);
        this.dbName = this.mongooseInstance.connection.db.databaseName;
        LOGGER.log('infoMDB' ,`Connection to MongoDB Cluster [DB:${this.dbName}] successful...`);
    }

    private async execute(callback: () => Promise<void>): Promise<void> {
        try {
            await this.initConnection();
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
            LOGGER.log('infoMDB', `Connection to MongoDB Cluster [DB:${this.dbName}] closed...`);
            await this.mongooseInstance?.connection.close();
            this.mongooseInstance = undefined;
        }
    }

    public async createCollection(collectionName: string, schema: Schema): Promise<void> {
        await this.execute(async () => {
            let model: any = this.mongooseInstance?.model(collectionName, schema);
            await model.createCollection();
        });
    }

    public async collectionExists(collectionName: string): Promise<boolean> {
        LOGGER.log('infoMDB', `Check exists for ${this.dbName}:${collectionName} ...`);
        let res: boolean = false;
        await this.execute(async () => {
            let collections: any = await this.mongooseInstance?.connection.db.listCollections().toArray();
            for (let elem = 0; elem < collections.length; elem++) if (collections[elem].name == collectionName) res = true;
        });
        return res;
    }

    public async getCollectionCount(collectionName: string, schema: Schema): Promise<number | undefined> {
        let res: number | undefined = 0;
        await this.execute(async () => {
            let Model = this.mongooseInstance?.connection.model(collectionName, schema);
            res = await Model?.countDocuments();
        });
        return res;
    }

    // public async getAggregation(pipeline: any) {

    // }

    public async insertAny(collectionName: string, objects: any[]): Promise<void> {
        await this.execute(async () => {
            let collection: Collection | undefined = this.mongooseInstance?.connection.collection(collectionName);
            LOGGER.log("infoMDB", `InsertAny into ${this.dbName}:${collectionName}:${objects.length}`);
            for (let elem = 0; elem < objects.length; elem++) await collection?.insertOne(objects[elem]);
        });
    }

}

const createAndInsert = async (environment_url: string, params: { collectionName: string, schema: Schema, objects: any[] }[]): Promise<void> => {
    let instance: MongoDBInquisitor = MongoDBInquisitor.init(environment_url);
    for (let elem = 0; elem < params.length; elem++) {
        if (!(await instance.collectionExists(params[elem].collectionName))) {
            await instance.createCollection(params[elem].collectionName, params[elem].schema);
            await instance.insertAny(params[elem].collectionName, params[elem].objects);
        } else if ((await instance.getCollectionCount(params[elem].collectionName, params[elem].schema)) == 0) 
            await instance.insertAny(params[elem].collectionName, params[elem].objects);
    }
}

export const setMongoDBCluster = async (...environments_url: string[]): Promise<void> => {
    let products: Product[] = await ProductService.getProducts();
    let users: User[] = await UserService.getUsers();
    for (let elem = 0; elem < environments_url.length; elem++) {
        await createAndInsert(environments_url[elem], [{collectionName: "users", schema: Schemas[SchemasName.USER], objects: users}]);
        await createAndInsert(environments_url[elem], [{collectionName: "products", schema: Schemas[SchemasName.PRODUCT], objects: products}]);
    }
}