import { Entity } from "../interfaces/entity.interface";
import { Product } from "../interfaces/product.interface";
import { User } from "../interfaces/user.interface";
import { ProductModel } from "../models/product.model";
import { UserModel } from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { FileUtils } from "./fileUtils";
import { JsonUtils } from "./jsonUtils";

/**
 * @ref 
 * - https://fakestoreapi.com/docs
 * - https://stackoverflow.com/questions/44855839/nodemon-keeps-restarting-server#:~:text=If%20your%20db's%20.,nodemon%20configuration%20(if%20possible).
 */
export class FakeStore {

    public static DATA_DIRECTORY_PATH = "./DATA/";
    public static PRODUCTS_DATA_PATH = this.DATA_DIRECTORY_PATH + "products.json";
    public static PRODUCTS_FAKEDATA_ENDPOINT = "https://fakestoreapi.com/products";
    public static USERS_DATA_PATH = this.DATA_DIRECTORY_PATH + "users.json";
    public static USERS_FAKEDATA_ENDPOINT = "https://fakestoreapi.com/users";

    private static async setUsersData(): Promise<void> {
        let fetchResponse: any = await fetch(this.USERS_FAKEDATA_ENDPOINT);
        let jsonUtils: JsonUtils<User> = new JsonUtils<User>();
        let users: User[] = jsonUtils.toArray(JSON.stringify(await fetchResponse.json()));
        for (let elem = 0; elem < users.length; elem++) users[elem].password = await AuthService._hashPwd(users[elem].password);
        await FileUtils.writeFile_(this.USERS_DATA_PATH, JSON.stringify(users));
    }

    private static async setProducsData(): Promise<void> {
        let fetchResponse: any = await fetch(this.PRODUCTS_FAKEDATA_ENDPOINT);
        let jsonUtils: JsonUtils<Product> = new JsonUtils<Product>();
        let products: ProductModel[] = jsonUtils.toArray(JSON.stringify(await fetchResponse.json()));
        for (let elem = 0; elem < products.length; elem++) products[elem].stock = Math.floor(Math.random() * 20);
        await FileUtils.writeFile_(this.PRODUCTS_DATA_PATH, JSON.stringify(products));
    }
    
    public static async setAllData(): Promise<void> {
        if (!await FileUtils.exists(this.USERS_DATA_PATH) || !await FileUtils.exists(this.PRODUCTS_DATA_PATH)) {
            FileUtils.createDirectory_(this.DATA_DIRECTORY_PATH);
            await this.setProducsData();
            await this.setUsersData();
        }
    }
}