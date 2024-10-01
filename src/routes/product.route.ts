import { Router  } from "express";
import { ProductController } from "../controllers/product.controller";

export const router: Router = Router();
export const PRODUCT_ENDPOINT_PREFIX = "/product";
const productController: ProductController = new ProductController();

router.get(PRODUCT_ENDPOINT_PREFIX, productController.getAll);
router.get(PRODUCT_ENDPOINT_PREFIX + "/minPrice=:min&maxPrice=:max", productController.getAllByPrice);
router.get(PRODUCT_ENDPOINT_PREFIX + "/minStock=:min&maxStock=:max", productController.getAllByStock);
router.get(PRODUCT_ENDPOINT_PREFIX + "/att=:attribute&v=:value", productController.getOne);
router.post(PRODUCT_ENDPOINT_PREFIX + "/save", productController.addOne);
router.patch(PRODUCT_ENDPOINT_PREFIX + "/remove/att=:attribute&v=:value", productController.removeOne);