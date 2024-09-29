// import { Product } from "../interfaces/product.interface";
// import productData from '../../DATA/products.json';
// import { JsonUtils } from "../utils/jsonUtils";
// import { FakeStore } from "../utils/fakeStore";

// export class ProductService {

//     private static jsonUtils: JsonUtils<Product> = new JsonUtils<Product>();
    
//     public static getProducts(): Product[] {
//         return this.jsonUtils.toArray(productData);
//     }

//     public static getProductsByCategory(category: string) {
//         return this.getProducts().filter(product => product.category == category);
//     }
    
//     public static getProductsByPrice(min: number, max: number) {
//         return this.getProducts().filter(product => product.price >= min && product.price <= max);
//     }

//     public static getProductById(id: number): Product | null {
//         let products: Product[] = this.getProducts();
//         for (let elem: number = 0; elem < products.length; elem++) if (products[elem].id == id) return products[elem];
//         return null;
//     }

//     public static getProductByTitle(title: string): Product | null {
//         let products: Product[] = this.getProducts();
//         for (let elem: number = 0; elem < products.length; elem++) if (products[elem].title == title) return products[elem];
//         return null;
//     }

//     public static addProduct(product: Product) {
//         this.jsonUtils.addObject(product, productData, FakeStore.PRODUCTS_DATA_PATH);
//     }

//     public static removeProduct(product: Product) {

//     }

// }