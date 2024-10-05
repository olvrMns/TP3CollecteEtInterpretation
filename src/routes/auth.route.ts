import { Router  } from "express";
import { AuthController } from "../controllers/auth.controller";

export const router: Router = Router();

router.use(AuthController.isAuthenticated);
router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);