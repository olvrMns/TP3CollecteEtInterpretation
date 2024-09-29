import { Request, Response } from "express";
import { Controller } from "../interfaces/controller.interface";
import { Product } from "../interfaces/product.interface";
import { ProductService } from "../services/product.service";


export class ProductController implements Controller<Product> {

    async getOne(request: Request, response: Response): Promise<void> {
        
    }

    async getAll(request: Request, response: Response): Promise<void> {
        
    }

    async addOne(request: Request, response: Response): Promise<void> {
        
    }

    async removeOne(request: Request, response: Response): Promise<void> {
        
    }

}