import { Router, Request, Response } from "express";
import {ParamsDictionary} from 'express-serve-static-core';
import { ProductController } from "../controllers/product.controller";

export const router: Router = Router();
const productController: ProductController = new ProductController();

router.get("/", productController.getAll);
router.get("/test", (request: Request, response: Response) => productController.getOne(request, response));
