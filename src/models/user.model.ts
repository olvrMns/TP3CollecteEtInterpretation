import { User } from "../interfaces/user.interface";
import { Address } from "../interfaces/user.interface";
import { Name } from "../interfaces/user.interface";

export class UserModel implements User {

    constructor(
        public id: number, 
        public email: string, 
        public username: string, 
        public password: string,
        public name: Name,
        public address: Address,
        public phone: string) {
    }

}