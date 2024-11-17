import { Roles, User } from "../interfaces/user.interface";
import { UserModel } from "../models/user.model";
import { FakeStore } from "../utils/fakeStore";
import { FileUtils } from "../utils/fileUtils";
import { JsonUtils } from "../utils/jsonUtils";
import { RegexUtils } from "../utils/regexUtils";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { CrudError } from "../errors/crud.error";

export class UserService {
    
    public static jsonUtils: JsonUtils<User> = new JsonUtils<User>();
    
    public static async getUsers(): Promise<User[]> {
        return this.jsonUtils.toArray(await FileUtils.readFile_(FakeStore.USERS_DATA_PATH));
    }

    public static async getUser(attributeName: string, value: string): Promise<User | null> {
        let users: User[] = await this.getUsers();
        for (let elem = 0; elem < users.length; elem++) if (users[elem]?.[attributeName] + "" == value) return users[elem];
        return null;
    }

    public static async addUser(user: User) {
        return this.jsonUtils.addObject(user, FakeStore.USERS_DATA_PATH);
    }

    public static async updateRole(email: string, role: Roles): Promise<boolean> {
        let users: User[] = await this.getUsers();
        for (let elem = 0; elem < users.length; elem++) if (users[elem].email == email) users[elem].role = role;
        return await FileUtils.writeFile_(FakeStore.USERS_DATA_PATH, JSON.stringify(users));
    }

    public static async isUnique(attributeName: string, value: string): Promise<boolean> {
        let users: User[] = await this.getUsers();
        for (let elem = 0; elem < users.length; elem++) if (users[elem]?.[attributeName] == value) return false;
        return true;
    }

    public static async getValidUser(request: Request): Promise<User> {
        if (!await this.isUnique("username", request.body.username)) throw CrudError.notUniqueError("username");
        if (!await this.isUnique("email", request.body.email)) throw CrudError.notUniqueError("email");
        let user: User = UserModel.getInstance(
            RegexUtils.testEmail(request.body.email),
            RegexUtils.testUsername(request.body.username),
            await AuthService._hashPwd(RegexUtils.testPassword(request.body.password)),
            { firstName: RegexUtils.testFirstLastName(request.body.name.firstName), lastName: RegexUtils.testFirstLastName(request.body.name.lastName) }
        );
        return user;
    }
}