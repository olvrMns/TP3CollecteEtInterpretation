import { Roles, User } from "../interfaces/user.interface";
import { UserModel } from "../models/user.model";
import { FakeStore } from "../utils/fakeStore";
import { FileUtils } from "../utils/fileUtils";
import { JsonUtils } from "../utils/jsonUtils";
import { RegexUtils } from "../utils/regexUtils";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { CrudError } from "../errors/crud.error";
import { ModelData, SchemaID, Schemas } from "../utils/mongoDB/schemas";
import { MongoDBInquisitor } from "../utils/mongoDB/mongoDB";
import { PipelineStage } from "mongoose";

export class UserService {
    
    public static jsonUtils: JsonUtils<User> = new JsonUtils<User>();
    private static modelData: ModelData = Schemas[SchemaID.USER];
    private static instance: MongoDBInquisitor = MongoDBInquisitor.init(String(process.env.MONGODB_URL));

    private static mapQueryResult(queryResult: any, aggregation: boolean = true): User[] {
        let users: User[] = [];
        queryResult.map(object => {
            if (!aggregation) object = object.toObject();
            users.push({
                address: object.address,
                email: object.email,
                username: object.username,
                password: object.password,
                name: object.name,
                phone: object.phone,
                role: object.role
            });
        }); 
        return users;
    }

    private static async getResult(pipeline: PipelineStage[]): Promise<User[]> {
        return this.mapQueryResult(await this.instance.getAggregation(this.modelData, pipeline));
    }

    public static async getUsers(): Promise<User[]> {
        return this.mapQueryResult(this.instance.getAllDocuments(this.modelData), false);
    }

    public static async getUser(attributeName: string, value: string): Promise<User> {
        let users: User[] = await this.getResult([{$match:{[attributeName]:value}}]);
        return users[0];
    }

    public static async addUser(user: User) {
        return this.instance.insertAny(this.modelData.collectionName, [user]);
    }

    public static async updateRoleByEmail(email: string, role: Roles): Promise<void> {
        await this.instance.updateOne(this.modelData.collectionName, {email: email}, {$set:{role: role}});
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