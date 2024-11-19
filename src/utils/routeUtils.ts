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

    /**
     * @note
     * returns a Middleware with excludedPaths (that are not affected by the middleware)
     */
    public static getConditionalRoute(middleware: ExpressMiddlewareCallback, ...excludedPaths: string[]): (request: Request, response: Response, next: NextFunction) => void | Promise<void> {
        return (request: Request, response: Response, next: NextFunction) => {
            if (excludedPaths.includes(request.path)) return next();
            else return middleware(request, response, next);
        }
    }

    public static getAuthorizedRoute(expressCallback: ExpressCallback, ...roles: Roles[]): (request: Request, response: Response) => Promise<void> {
        return (request: Request, response: Response) => {
            //roles.length == 0 anyone can access 
            // || roles.includes(request.user?.role as Roles) user has the right role(s)
            if (roles.length == 0 || roles.includes(request.user?.role as Roles)) return expressCallback(request, response); 
            else return this.sendUnauthorized(request, response);
        }
    }

    public static async sendUnauthorized(request: Request, response: Response) {
        response.status(StatusCodes.UNAUTHORIZED).send("Auth error...");
    }

}