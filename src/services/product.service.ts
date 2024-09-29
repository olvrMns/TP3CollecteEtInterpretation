import { Product } from "../interfaces/product.interface";
import { JsonUtils } from "../utils/jsonUtils";
import { FakeStore } from "../utils/fakeStore";
import { FileUtils } from "../utils/fileUtils";

export class ProductService {

    private static jsonUtils: JsonUtils<Product> = new JsonUtils<Product>();
    
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

    public static async getProductById(id: number): Promise<Product | null> {
        let products: Product[] = await this.getProducts();
        for (let elem: number = 0; elem < products.length; elem++) if (products[elem].id == id) return products[elem];
        return null;
    }

    public static async getProductByTitle(title: string): Promise<Product | null> {
        let products: Product[] = await this.getProducts();
        for (let elem: number = 0; elem < products.length; elem++) if (products[elem].title == title) return products[elem];
        return null;
    }

    public static async addProduct(product: Product): Promise<boolean> {
        return await this.jsonUtils.addObject(product, FakeStore.PRODUCTS_DATA_PATH);
    }

    public static async removeProduct(product: Product) {
        return await this.jsonUtils.removeObject(product, FakeStore.PRODUCTS_DATA_PATH);
    }

}