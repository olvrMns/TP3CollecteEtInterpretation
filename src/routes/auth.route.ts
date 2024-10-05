import { NextFunction, Request, Response, Router  } from "express";
import { AuthController } from "../controllers/auth.controller";

export const router: Router = Router();

//router.get("/*", AuthController.isAuthenticated);
router.post("/login", AuthController.login);
router.get("/signup", AuthController.signup)