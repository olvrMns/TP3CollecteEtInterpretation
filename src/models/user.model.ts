import { Roles, User } from "../interfaces/user.interface";
import { Address } from "../interfaces/user.interface";
import { Name } from "../interfaces/user.interface";

export class UserModel implements User {

    constructor(
        public email: string, 
        public username: string, 
        public password: string,
        public name: Name,
        public address: Address | null,
        public phone: string | null,
        public role: number = Roles.EMPLOYEE) {
    }

    public static getInstance(email: string, username: string, password: string, name: Name) {
        return new UserModel(email, username, password, name, null, null);
    }

}

export class UserInfo {

    constructor(
        public email: string, 
        public name: Name, 
        public username: string) {}

        
    public static getInstance(email: string, name: Name, username: string): UserInfo {
        return new UserInfo(email, name, username);
    }

}