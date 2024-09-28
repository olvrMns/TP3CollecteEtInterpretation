import { ProductController } from "../controllers/product.controller";
import { Product } from "../interfaces/product.interface";
import productData from '../../DATA/products.json';

export class ProductService {
    
    public getProducts(): Product[] {
        let products: Product[] = [];

        return products;
    }

    public getProductById(id: number): Product | null {
        let product: Product | null = null;

        return product;
    }
}