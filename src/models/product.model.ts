import { Product } from "../interfaces/product.interface";


export class ProductModel implements Product {

    constructor(
        public id: number,
        public title: string,
        public price: number,
        public description: number,
        public image: string,
        public category: string) {
    }
}