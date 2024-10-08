import { Router  } from "express";
import { ProductController } from "../controllers/product.controller";
import { RouteUtils } from "../utils/routeUtils";
import { Roles } from "../interfaces/user.interface";

export const router: Router = Router();
export const PRODUCT_ENDPOINT_PREFIX = "/product";
const productController: ProductController = new ProductController();

router.get(PRODUCT_ENDPOINT_PREFIX, RouteUtils.getAuthorizedRoute(productController.getAll, Roles.EMPLOYEE));
router.get(PRODUCT_ENDPOINT_PREFIX + "/minPrice=:min&maxPrice=:max", productController.getAllByPrice);
router.get(PRODUCT_ENDPOINT_PREFIX + "/minStock=:min&maxStock=:max", productController.getAllByStock); //needs fix
router.get(PRODUCT_ENDPOINT_PREFIX + "/att=:attribute&v=:value", productController.getOne);
router.post(PRODUCT_ENDPOINT_PREFIX + "/save", productController.addOne);
router.patch(PRODUCT_ENDPOINT_PREFIX + "/remove/att=:attribute&v=:value", productController.removeOne);