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

export class ProductService {

    public static jsonUtils: JsonUtils<Product> = new JsonUtils<Product>();
    private static modelData: ModelData = Schemas[SchemaID.PRODUCT];
    private static instance: MongoDBInquisitor = MongoDBInquisitor.init(String(process.env.MONGODB_URL_DEV));

    private static mapQueryResult(queryResult: any): Product[] {
        let products: Product[] = [];
        queryResult.map(object => {
            object = object.toObject();
            products.push({
                id: object.id,
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
    
    public static async getProducts(): Promise<Product[]> {
        return this.mapQueryResult(await this.instance.getAllDocuments(this.modelData));
    }

    public static async getProductsByCategory(category: string): Promise<Product[]> {
        return this.mapQueryResult(await this.instance.getAggregation(this.modelData, PipelineID.PRODUCTS_BY_CATEGORY));
    }
    
    public static async getProductsByPrice(min: number, max: number): Promise<Product[]> {
        let products: Product[] = await this.getProducts();
        return products.filter(product => product.price >= min && product.price <= max);
    }

    public static async getProductsByStock(min: number, max: number): Promise<Product[]> {
        let products: Product[] = await this.getProducts();
        return products.filter(product => product.stock >= min && product.stock <= max);
    }

    /**
     * @note ...
     */
    public static async getProduct(attributeName: string, value: string): Promise<Product | null> {
        let products: Product[] = await this.getProducts();
        for (let elem: number = 0; elem < products.length; elem++) 
            if (products[elem]?.[attributeName] + "" == value) return products[elem] 
        throw APIError.entityNotFound();
    }

    public static async addProduct(product: Product): Promise<boolean> {
        return await this.jsonUtils.addObject(product, FakeStore.PRODUCTS_DATA_PATH);
    }

    public static async getValidProduct(request: Request): Promise<Product> {
        let nProduct: Product = new ProductModel(
            await ProductService.jsonUtils.getUniqueId(await ProductService.getProducts()),
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

    public static async removeProduct(product: Product) {
        return await this.jsonUtils.removeObject(product, FakeStore.PRODUCTS_DATA_PATH);
    }

}