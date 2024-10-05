import { User } from "../interfaces/user.interface";
import { FakeStore } from "../utils/fakeStore";
import { FileUtils } from "../utils/fileUtils";
import { JsonUtils } from "../utils/jsonUtils";

export class UserService {
    
    private static jsonUtils: JsonUtils<User> = new JsonUtils<User>();
    
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
}