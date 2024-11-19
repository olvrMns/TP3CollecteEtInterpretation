import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../errors/api.error";
import { AuthError } from "../errors/auth.error";
import { CrudError } from "../errors/crud.error";
import { User } from "../interfaces/user.interface";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { LogMessages } from "../utils/log/logMessages";
import { LOGGER } from "../utils/log/winstonLogger";
import { RouteUtils } from "../utils/routeUtils";

export class AuthController {

    public static async isAuthenticated(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let authString: string | undefined = request.headers.authorization;
            let token: string | null = null;
            let payload: any;
            if (authString) token = authString.split(' ')[1];
            else throw AuthError.notAuthenticatedError();
            if (token) payload = await AuthService.verifyToken(token);
            else throw AuthError.otherError();
            request.user = await UserService.getUser("email", payload.userInfo.email) as User;
            next();
        } catch (error: unknown) { 
            response.sendStatus(StatusCodes.UNAUTHORIZED)
        }
    }

    public static async login(request: Request, response: Response): Promise<void> {
        try {
            LOGGER.alert(LogMessages.LOGIN_REQUEST_RECEIVED);
            let user: User | null = await AuthService.authenticateUser(request.body.username, request.body.password);
            if (user) response.status(StatusCodes.OK).send(await AuthService.createToken(user));
            else throw AuthError.credentialsError();
        } catch (error: unknown) {
            response.sendStatus(StatusCodes.UNAUTHORIZED)
        }
    }

    public static async signup(request: Request, response: Response) {
        try {
            LOGGER.alert(LogMessages.SIGNUP_REQUEST_RECEIVED);
            let user = await UserService.getValidUser(request);
            await UserService.addUser(user) 
            response.sendStatus(StatusCodes.CREATED);
        } catch (error: unknown) { 
            response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}