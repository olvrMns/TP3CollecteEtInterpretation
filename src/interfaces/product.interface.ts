import { Entity } from "./entity.interface"

export interface Rating {
    rate: number,
    count: number
}

/**
 * @ref 
 * - https://github.com/keikaavousi/fake-store-api/blob/master/model/product.js
 */
export interface Product extends Entity {
    title: string,
    price: number,
    description: string,
    image: string,
    category: string,
    rating: Rating
}