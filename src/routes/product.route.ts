import { Router, Request, Response } from "express";
import { ProductController } from "../controllers/product.controller";

export const router: Router = Router();
const productController: ProductController = new ProductController();

router.get("/product", productController.getAll);
router.get("/product/id=:id", productController.getOne);
router.post("/product/save", productController.addOne);
router.patch("/product/remove", productController.removeOne);