import { Request } from "express";
import { Product } from "../interfaces/product.interface";
import { ProductModel } from "../models/product.model";
import { FakeStore } from "../utils/fakeStore";
import { FileUtils } from "../utils/fileUtils";
import { JsonUtils } from "../utils/jsonUtils";
import { RegexUtils } from "../utils/regexUtils";

export class ProductService {

    public static jsonUtils: JsonUtils<Product> = new JsonUtils<Product>();
    
    public static async getProducts(): Promise<Product[]> {
        return this.jsonUtils.toArray(await FileUtils.readFile_(FakeStore.PRODUCTS_DATA_PATH));
    }

    public static async getProductsByCategory(category: string): Promise<Product[]> {
        let products: Product[] = await this.getProducts();
        return products.filter(product => product.category == category);
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
        return null;
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