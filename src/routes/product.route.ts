import { Router  } from "express";
import { ProductController } from "../controllers/product.controller";
import { RouteUtils } from "../utils/routeUtils";
import { Roles } from "../interfaces/user.interface";

export const router: Router = Router();
export const PRODUCT_ENDPOINT_PREFIX = "/product";
const productController: ProductController = new ProductController();

router.get(PRODUCT_ENDPOINT_PREFIX, 
    RouteUtils.getAuthorizedRoute(productController.getAll));

router.get(PRODUCT_ENDPOINT_PREFIX + "/minPrice=:min&maxPrice=:max", 
    RouteUtils.getAuthorizedRoute(productController.getAllByPrice));

router.get(PRODUCT_ENDPOINT_PREFIX + "/minStock=:min&maxStock=:max", 
    RouteUtils.getAuthorizedRoute(productController.getAllByStock)); //needs fix

router.get(PRODUCT_ENDPOINT_PREFIX + "/att=:attribute&v=:value", 
    RouteUtils.getAuthorizedRoute(productController.getOne));

router.post(PRODUCT_ENDPOINT_PREFIX + "/save", 
    RouteUtils.getAuthorizedRoute(productController.addOne, Roles.ADMINISTRATOR));

router.patch(PRODUCT_ENDPOINT_PREFIX + "/remove/att=:attribute&v=:value", 
    RouteUtils.getAuthorizedRoute(productController.removeOne, Roles.ADMINISTRATOR));