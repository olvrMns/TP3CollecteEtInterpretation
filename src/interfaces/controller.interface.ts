import { Entity } from "./entity.interface";
import { Request, Response } from "express";


export interface Controller<T extends Entity> {

    getOne(request: Request, response: Response): Promise<void>;
    getAll(request: Request, response: Response): Promise<void>;
    addOne(request: Request, response: Response): Promise<void>;
    removeOne(request: Request, response: Response): Promise<void>;
    
}