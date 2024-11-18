import { Schema } from "mongoose";
import { Product } from "../../interfaces/product.interface";
import { User } from "../../interfaces/user.interface";

export enum SchemaID {
    USER,
    PRODUCT
}

export type ModelData = {collectionName: string, schema: Schema}

/**
 * @note 
 * Record<SchemasName, Schema>
 * [key in SchemasName]
 * [key in SchemasName]? - optional
 */
export const Schemas: Record<SchemaID, ModelData> = {
    [SchemaID.USER]: {collectionName: "users", schema: new Schema<User>()},
    [SchemaID.PRODUCT]: {collectionName: "products", schema: new Schema<Product>()}
}