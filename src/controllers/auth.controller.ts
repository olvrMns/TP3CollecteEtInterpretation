import { NextFunction, Request, Response } from "express";
import { LOGGER } from "../utils/log/winstonLogger";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth.service";
import { User } from "../interfaces/user.interface";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";

export class AuthController {

    public static async isAuthenticated(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            LOGGER.info("IN ROUTE")
            response.send("salut");
        } catch (error) {
            response.send("bye");
        }
    }

    public static async login(request: Request, response: Response): Promise<void> {
        try {
            let user: User | null = await AuthService.authenticate(request.body.username, request.body.password);
            if (user) response.status(StatusCodes.OK).send(await AuthService.createToken(user));
            else throw new Error();
        } catch (error) { response.status(StatusCodes.BAD_REQUEST).send(error); }
    }

    public static async signup(request: Request, response: Response) {
        try {
            let user: User = UserModel.getInstance(
                await UserService.jsonUtils.getUniqueId(await UserService.getUsers()),
                request.body.email,
                request.body.username,
                await AuthService._hashPwd(request.body.password),
                request.body.name
            );
            response.status(StatusCodes.CREATED).send(await UserService.addUser(user));
        } catch (error) { response.sendStatus(StatusCodes.BAD_REQUEST); }
    }
}