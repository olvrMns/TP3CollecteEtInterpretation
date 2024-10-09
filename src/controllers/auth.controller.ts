import { NextFunction, Request, Response } from "express";
import { LOGGER } from "../utils/log/winstonLogger";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth.service";
import { User } from "../interfaces/user.interface";
import { UserInfo, UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { LogMessages } from "../utils/log/logMessages";
import { AuthError } from "../errors/auth.error";
import { RouteUtils } from "../utils/routeUtils";
import { RegexUtils } from "../utils/regexUtils";
import { FormatError } from "../errors/format.error";
import { CrudError } from "../errors/crud.error";
import { APIError } from "../errors/abs.error";

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
            response.status(StatusCodes.UNAUTHORIZED);
            if (error instanceof APIError) response.send(error.message); 
            else RouteUtils.sendUnexpectedMessage(response, error);
        }
    }

    public static async login(request: Request, response: Response): Promise<void> {
        try {
            LOGGER.alert(LogMessages.LOGIN_REQUEST_RECEIVED);
            let user: User | null = await AuthService.authenticateUser(request.body.username, request.body.password);
            if (user) response.status(StatusCodes.OK).send(await AuthService.createToken(user));
            else throw AuthError.credentialsError();
        } catch (error: unknown) {
            if (error instanceof APIError) response.status(StatusCodes.BAD_REQUEST).send(error.message);
            else RouteUtils.sendUnexpectedMessage(response, error);
        }
    }

    public static async signup(request: Request, response: Response) {
        try {
            LOGGER.alert(LogMessages.SIGNUP_REQUEST_RECEIVED);
            if (await UserService.addUser(await UserService.getValidUser(request))) response.sendStatus(StatusCodes.CREATED);
            else throw CrudError.unexpectedSaveError();
        } catch (error: unknown) { 
            if (error instanceof APIError) response.status(StatusCodes.BAD_REQUEST).send(error.message); 
            else RouteUtils.sendUnexpectedMessage(response, error);
        }
    }
}