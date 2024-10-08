import { NextFunction, Request, Response } from "express";
import { LOGGER } from "../utils/log/winstonLogger";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth.service";
import { User } from "../interfaces/user.interface";
import { UserInfo, UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { LogMessages } from "../utils/log/logMessages";
import { JwtPayload } from "jsonwebtoken";

export class AuthController {

    public static async isAuthenticated(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let authorizationString: string | undefined = request.headers.authorization;
            let token: string | null = null;
            let payload: string | JwtPayload | undefined = undefined;
            if (authorizationString) token = authorizationString.split(' ')[1];
            else throw new Error();
            if (token) payload = await AuthService.verifyToken(token);
            else throw new Error();
            console.log(Object.values(payload as object));
            next();
        } catch (error: unknown) { response.status(StatusCodes.UNAUTHORIZED).send("NOT AUTHENTICATED"); }
    }

    public static async login(request: Request, response: Response): Promise<void> {
        try {
            LOGGER.alert(LogMessages.LOGIN_REQUEST_RECEIVED);
            let user: User | null = await AuthService.authenticateUser(request.body.username, request.body.password);
            if (user) response.status(StatusCodes.OK).send(await AuthService.createToken(user));
            else throw new Error("ERRUR?");
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST); 
        }
    }

    public static async signup(request: Request, response: Response) {
        try {
            LOGGER.alert(LogMessages.SIGNUP_REQUEST_RECEIVED);
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