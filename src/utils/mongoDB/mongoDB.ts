import {
    Collection,
    connect,
    Mongoose,
    PipelineStage,
    Schema
} from 'mongoose';
import { Product } from '../../interfaces/product.interface';
import { Roles, User } from '../../interfaces/user.interface';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { LOGGER } from '../log/winstonLogger';
import { Schemas, SchemaID, ModelData } from './schemas';
import { PipelineID, pipelines } from './pipelines';
import { JsonUtils } from '../jsonUtils';
import { FileUtils } from '../fileUtils';
import { FakeStore } from '../fakeStore';

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
            console.log("error: " + ex)
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

    public async createCollection(modelData: ModelData): Promise<void> {
        await this.execute(async () => {
            let Model = this.mongooseInstance?.model(modelData.collectionName, modelData.schema);
            await Model?.createCollection();
        });
    }

    public async collectionExists(collectionName: string): Promise<boolean> {
        let res: boolean = false;
        await this.execute(async () => {
            LOGGER.log('infoMDB', `Check exists for ${this.dbName}:${collectionName} ...`);
            let collections: any = await this.mongooseInstance?.connection.db.listCollections().toArray();
            for (let elem = 0; elem < collections.length; elem++) if (collections[elem].name == collectionName) {
                res = true;
            }
        });
        return res;
    }

    public async getCollectionCount(modelData: ModelData): Promise<number | undefined> {
        let res: number | undefined = 0;
        await this.execute(async () => {
            let Model = this.mongooseInstance?.connection.model(modelData.collectionName, modelData.schema);
            res = await Model?.countDocuments();
        });
        return res;
    }

    public async getAllDocuments(modelData: ModelData): Promise<any> {
        let res: any;
        await this.execute(async () => {
            let Model = this.mongooseInstance?.connection.model(modelData.collectionName, modelData.schema);
            res = await Model?.find();
        });
        return res;
    }

    public async getAggregation(modelData: ModelData, pipeline: PipelineStage[]): Promise<any> {
        let res: any;
        await this.execute(async () => {
            let Model = this.mongooseInstance?.connection.model(modelData.collectionName, modelData.schema);
            res = await Model?.aggregate(pipeline);
        });
        return res;
    }

    public async insertAny(collectionName: string, objects: any[]): Promise<void> {
        await this.execute(async () => {
            LOGGER.log("infoMDB", `InsertAny into ${this.dbName}:${collectionName}:${objects.length}`);
            let collection: Collection | undefined = this.mongooseInstance?.connection.collection(collectionName);
            for (let elem = 0; elem < objects.length; elem++) await collection?.insertOne(objects[elem]);
        });
    }

    public async deleteAny(collectionName: string, objects: any[]): Promise<void> {
        await this.execute(async () => {
            LOGGER.log("infoMDB", `DeleteAny from ${this.dbName}:${collectionName}:${objects.length}`);
            let collection: Collection | undefined = this.mongooseInstance?.connection.collection(collectionName);
            for (let elem = 0; elem < objects.length; elem++) await collection?.deleteOne(objects[elem]);
        })
    }

    public async updateOne(collectionName: string, filter: any, updateFilter: any) {
        await this.execute(async () => {
            let collection: Collection | undefined = this.mongooseInstance?.connection.collection(collectionName);
            await collection?.updateOne(filter, updateFilter);
        });
    }

}

const createAndInsert = async (environment_url: string, params: { schemaID: SchemaID, objects: any[] }[]): Promise<void> => {
    let instance: MongoDBInquisitor = MongoDBInquisitor.init(environment_url);
    for (let elem = 0; elem < params.length; elem++) {
        if (!(await instance.collectionExists(Schemas[params[elem].schemaID].collectionName))) {
            await instance.createCollection(Schemas[params[elem].schemaID]);
            await instance.insertAny(Schemas[params[elem].schemaID].collectionName, params[elem].objects);
        } else if ((await instance.getCollectionCount(Schemas[params[elem].schemaID]) == 0)) 
            await instance.insertAny(Schemas[params[elem].schemaID].collectionName, params[elem].objects);
    }
}

/**
 * @note
 * - to remove ids
 * - needs reformating...  
 */
const removeIDs = (objects: any[]): void => {
    for (let elem of objects) 
        delete elem.id
}

export const setMongoDBCluster = async (...environments_url: string[]): Promise<void> => {
    let productsJsonUtils: JsonUtils<Product> = new JsonUtils<Product>();
    let usersJsonUtils: JsonUtils<User> = new JsonUtils<User>();
    let products: Product[] = productsJsonUtils.toArray(await FileUtils.readFile_(FakeStore.PRODUCTS_DATA_PATH));
    removeIDs(products)
    let users: User[] = usersJsonUtils.toArray(await FileUtils.readFile_(FakeStore.USERS_DATA_PATH));
    removeIDs(users);
    for (let elem = 0; elem < environments_url.length; elem++) 
        await createAndInsert(environments_url[elem], [{schemaID: SchemaID.USER, objects: users}, {schemaID: SchemaID.PRODUCT, objects: products}]);
    await UserService.updateRoleByEmail("morrison@gmail.com", Roles.ADMINISTRATOR);
}