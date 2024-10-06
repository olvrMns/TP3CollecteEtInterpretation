import { NextFunction, Request, Response } from "express";

export type ExpressCallback = (request: Request, response: Response, next: NextFunction) => Promise<void>;

/**
 * @ref
 * - https://stackoverflow.com/questions/27117337/exclude-route-from-express-middleware
 */
export class RouteUtils {

    public static getConditionalRoute(middleware: ExpressCallback, ...excludedPaths: string[]): (request: Request, response: Response, next: NextFunction) => void | Promise<void> {
        return (request: Request, response: Response, next: NextFunction) => {
            if (excludedPaths.includes(request.path)) return next();
            else return middleware(request, response, next);
        }
    }
}