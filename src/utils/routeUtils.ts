import { NextFunction, Request, Response } from "express";
import { Roles } from "../interfaces/user.interface";
import { AuthError } from "../errors/auth.error";
import { StatusCodes } from "http-status-codes";

export type ExpressMiddlewareCallback = (request: Request, response: Response, next: NextFunction) => Promise<void>;
export type ExpressCallback = (request: Request, response: Response) => Promise<void>;

/**
 * @ref
 * - https://stackoverflow.com/questions/27117337/exclude-route-from-express-middleware
 */
export class RouteUtils {

    public static getConditionalRoute(middleware: ExpressMiddlewareCallback, ...excludedPaths: string[]): (request: Request, response: Response, next: NextFunction) => void | Promise<void> {
        return (request: Request, response: Response, next: NextFunction) => {
            if (excludedPaths.includes(request.path)) return next();
            else return middleware(request, response, next);
        }
    }

    public static getAuthorizedRoute(expressCallback: ExpressCallback, ...roles: Roles[]): (request: Request, response: Response) => Promise<void> {
        return (request: Request, response: Response) => {
            if (Object.keys(roles).includes(request.user?.role.toString() as string)) return expressCallback(request, response);
            else throw AuthError.notAuthenticatedError();
        }
    }

    public static sendUnexpectedMessage(response: Response, error: unknown, status: StatusCodes = StatusCodes.UNAUTHORIZED): void {
        response.status(status).send("Something really unexpected happened! => " + String(error));
    }
}