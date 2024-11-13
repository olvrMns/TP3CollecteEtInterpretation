import { connect, Schema, createConnection, Model, model, Mongoose, Collection } from 'mongoose';
import { User } from '../interfaces/user.interface';
import { Product } from '../interfaces/product.interface';
import { LOGGER } from './log/winstonLogger';

export class MongoDBInquisitor {

    private mongooseInstance: Mongoose | undefined;

    private constructor(mongooseInstance: Mongoose) {
        this.mongooseInstance = mongooseInstance;
    }

    public static async init(url: string): Promise<MongoDBInquisitor | null> {
        try {
            let instance: Mongoose = await connect(url);
            LOGGER.info("Connection MongoDB Cluster successful...");
            return new MongoDBInquisitor(instance);
        } catch (ex: unknown) {
            LOGGER.error(String(ex));
            return null;
        }
    }

    public async createCollection(collectionName: string, schema: Schema): Promise<void> {
        let model = this.mongooseInstance?.model(collectionName, schema);
        await model?.createCollection();
    }

    public async closeConnection(): Promise<void> {
        await this.mongooseInstance?.connection.close();
    }
}

export const setMongoDBCluster = async (...environments_url: string[]) => {
    let userSchema: Schema = new Schema<User>();
    let productSchema: Schema = new Schema<Product>();
    for (let elem = 0; elem < environments_url.length; elem++) {
        let instance: MongoDBInquisitor | null = await MongoDBInquisitor.init(environments_url[elem]);
        await instance?.createCollection("users", userSchema);
        await instance?.createCollection("products", productSchema);
        await instance?.closeConnection();
    }
}