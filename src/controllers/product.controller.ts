import { Request, Response } from "express";
import { ParamsDictionary } from 'express-serve-static-core';
import { Controller } from "../interfaces/controller.interface";
import { Product } from "../interfaces/product.interface";
import { StatusCodes } from 'http-status-codes';
import { ProductService } from "../services/product.service";
import { LOGGER } from "../utils/log/winstonLogger";
import { LogMessages } from "../utils/log/logMessages";
import { ProductModel } from "../models/product.model";


/**
 * @ref
 * - https://stackoverflow.com/questions/71858480/how-to-make-typescript-type-annotation-for-req-body-without-overwriting-the-orig
 */
export class ProductController implements Controller {

    //Request<ParamsDictionary, any, {id: number}>
    public async getOne(request: Request, response: Response): Promise<void> {
        try {
            LOGGER.info(LogMessages.GET_ONE_PRODUCT_REQUEST_RECEIVED);
            let product: Product | null = await ProductService.getProduct(request.params.attribute, request.params.value);
            response.status(StatusCodes.OK).send(product);
        } catch (error) { response.status(StatusCodes.BAD_REQUEST); }
    }

    public async getAll(request: Request, response: Response): Promise<void> {
        try {
            LOGGER.info(LogMessages.GET_ALL_PRODUCT_REQUEST_RECEIVED);
            let products: Product[] = await ProductService.getProducts();
            response.status(StatusCodes.OK).send(products);
        } catch (error) { response.status(StatusCodes.BAD_REQUEST); }
    }

    public async addOne(request: Request, response: Response): Promise<void> {
        try {
            LOGGER.info(LogMessages.ADD_ONE_PRODUCT_REQUEST_RECEIVED);
            let product: Product = new ProductModel(
                await ProductService.getUniqueId(),
                request.body.title,
                request.body.price,
                request.body.description,
                request.body.image,
                request.body.category,
                request.body.stock,
                request.body.rating
            );
            await ProductService.addProduct(product);
            response.status(StatusCodes.OK).send(product);
        } catch (error) { response.status(StatusCodes.BAD_REQUEST); }
    }

    public async removeOne(request: Request, response: Response): Promise<void> {
        try {
            LOGGER.info(LogMessages.REMOVE_ONE_PRODUCT_REQUEST_RECEIVED);
            let product: Product | null = await ProductService.getProduct(request.params.attribute, request.params.value);
            await ProductService.removeProduct(product as Product);
            response.sendStatus(StatusCodes.OK);
        } catch (error) { response.sendStatus(StatusCodes.BAD_REQUEST); }
    }

    public async getAllByPrice(request: Request, response: Response): Promise<void> {
        try {
            const {params} = request;
            if (!params.min && !params.max) response.status(StatusCodes.OK).send(await ProductService.getProducts());
            let min: number = !params.min ? 0 : parseFloat(params.min);
            let max: number = !params.max ? Number.MAX_VALUE : parseFloat(params.max);
            response.status(StatusCodes.OK).send(await ProductService.getProductsByPrice(min, max));
        } catch (error) { response.sendStatus(StatusCodes.BAD_REQUEST); }
    }

    /**
     * @note needs refactoring (copy) 
     */
    public async getAllByStock(request: Request, response: Response): Promise<void> {
        try {
            const {params} = request;
            if (!params.min && !params.max) response.status(StatusCodes.OK).send(await ProductService.getProducts());
            let min: number = !params.min ? 0 : parseInt(params.min);
            let max: number = !params.max ? Number.MAX_VALUE : parseInt(params.max);
            response.status(StatusCodes.OK).send(await ProductService.getProductsByPrice(min, max));
        } catch (error) { response.sendStatus(StatusCodes.BAD_REQUEST); }
    }
}