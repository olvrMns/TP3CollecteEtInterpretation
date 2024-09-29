import { Request, Response } from "express";
import { ParamsDictionary } from 'express-serve-static-core';
import { Controller } from "../interfaces/controller.interface";
import { Product } from "../interfaces/product.interface";
import { StatusCodes } from 'http-status-codes';
import { ProductService } from "../services/product.service";
import { LOGGER } from "../utils/log/winstonLogger";


/**
 * @ref
 * - https://stackoverflow.com/questions/71858480/how-to-make-typescript-type-annotation-for-req-body-without-overwriting-the-orig
 */
export class ProductController implements Controller {

    //Request<ParamsDictionary, any, {id: number}>
    async getOne(request: Request, response: Response): Promise<void> {
        try {
            LOGGER.info("Get one product request received...");
            let product: Product | null = await ProductService.getProductById(request.body.id);
            response.status(StatusCodes.OK).send(product);
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST);
        }
    }

    async getAll(request: Request, response: Response): Promise<void> {
        try {
            let products: Product[] = await ProductService.getProducts();
            response.status(StatusCodes.OK).send(products);
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST);
        }
    }

    async addOne(request: Request, response: Response): Promise<void> {
        
    }

    async removeOne(request: Request, response: Response): Promise<void> {
        
    }

}