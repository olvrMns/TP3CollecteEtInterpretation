import { Router  } from "express";
import { AuthController } from "../controllers/auth.controller";
import { RouteUtils } from "../utils/routeUtils";

export const router: Router = Router();
export const LOGIN_ROUTE: string = "/login";
export const SIGNUP_ROUTE: string = "/signup";

router.use(RouteUtils.getConditionalRoute(AuthController.isAuthenticated, LOGIN_ROUTE, SIGNUP_ROUTE));

router.post(LOGIN_ROUTE, AuthController.login);
router.post(SIGNUP_ROUTE, AuthController.signup);