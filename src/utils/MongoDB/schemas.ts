import { Schema } from "mongoose";
import { Product } from "../../interfaces/product.interface";
import { User } from "../../interfaces/user.interface";

export enum SchemasName {
    USER,
    PRODUCT
}

/**
 * @note 
 * Record<SchemasName, Schema>
 * [key in SchemasName]
 * [key in SchemasName]? - optional
 * 
 */
export const Schemas: Record<SchemasName, Schema> = {
    [SchemasName.USER]: new Schema<User>(),
    [SchemasName.PRODUCT]: new Schema<Product>()
}