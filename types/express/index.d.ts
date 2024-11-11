import { User } from "../../src/interfaces/user.interface";

declare global {
    declare namespace Express {
        interface Request {
            user?: User;
        }
    }
}