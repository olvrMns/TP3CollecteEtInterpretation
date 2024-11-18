import { Request, Response, Router } from "express";

export const router: Router = Router();
router.get("/", (request: Request, response: Response) => { response.sendStatus(200) });