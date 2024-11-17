import { Request } from "express";
import { APIError } from "../errors/api.error";
import { Product } from "../interfaces/product.interface";
import { ProductModel } from "../models/product.model";
import { FakeStore } from "../utils/fakeStore";
import { FileUtils } from "../utils/fileUtils";
import { JsonUtils } from "../utils/jsonUtils";
import { RegexUtils } from "../utils/regexUtils";
import { ModelData, SchemaID, Schemas } from "../utils/mongoDB/schemas";
import { MongoDBInquisitor } from "../utils/mongoDB/mongoDB";
import { PipelineID, pipelines } from "../utils/mongoDB/pipelines";
import { PipelineStage } from "mongoose";

export class ProductService {

    public static jsonUtils: JsonUtils<Product> = new JsonUtils<Product>();
    private static modelData: ModelData = Schemas[SchemaID.PRODUCT];
    private static instance: MongoDBInquisitor = MongoDBInquisitor.init(String(process.env.MONGODB_URL_DEV));

    private static mapQueryResult(queryResult: any, aggregation: boolean = true): Product[] {
        let products: Product[] = [];
        queryResult.map(object => {
            if (!aggregation) object = object.toObject();
            products.push({
                title: object.title,
                price: object.price,
                description: object.description,
                category: object.category,
                image: object.image,
                stock: object.stock,
                rating: object.rating
            });
        }); 
        return products;
    }

    private static async getResult(pipeline: PipelineStage[]): Promise<Product[]> {
        return this.mapQueryResult(await this.instance.getAggregation(this.modelData, pipeline)); 
    }
    
    /**
     * 
     * @note 
     * getProducts for everything?
     */
    public static async getProducts(): Promise<Product[]> { 
        return this.mapQueryResult(await this.instance.getAllDocuments(this.modelData), false);
    }

    public static async getProductsByCategory(category: string): Promise<Product[]> {
        return await this.getResult([{$match: {"category":category}}]);
    }
    
    public static async getProductsByPrice(min: number, max: number): Promise<Product[]> {
        return await this.getResult([{$match: {"price": {$gte: min, $lte: max}}}]);
    }

    public static async getProductsByStock(min: number, max: number): Promise<Product[]> {
        return await this.getResult([{$match: {"stock": {$gte: min, $lte: max}}}]);
    }

    public static async getProduct(attributeName: string, value: string): Promise<Product> {
        let array: Product[] = await this.getResult([{$match: {[attributeName]:value}}])
        return array[0];
    }

    public static async addProduct(product: Product): Promise<void> {
        await this.instance.insertAny(this.modelData.collectionName, [product]);
    }

    public static async getValidProduct(request: Request): Promise<Product> {
        let nProduct: Product = new ProductModel(
                RegexUtils.testStrLimit(request.body.title, "title"),
                parseFloat(RegexUtils.testPositiveDecimal(request.body.price, "price")),
                RegexUtils.testStrLimit(request.body.description, "description", 5000),
                request.body.image,
                request.body.category,
                request.body.stock,
                {
                    rate: parseFloat(RegexUtils.testPositiveDecimal(request.body.rating.rate, "rate")), 
                    count: parseInt(RegexUtils.testPositiveDecimal(request.body.rating.count, "count"))
                }
        );
        return nProduct;
    }

    public static async removeProduct(product: Product): Promise<void> {
        await this.instance.deleteAny(this.modelData.collectionName, [product]);
    }

}