import { FileUtils } from "./fileUtils";

/**
 * @ref 
 * - https://fakestoreapi.com/docs
 * - https://stackoverflow.com/questions/44855839/nodemon-keeps-restarting-server#:~:text=If%20your%20db's%20.,nodemon%20configuration%20(if%20possible).
 */
export class FakeStore {

    public static DATA_DIRECTORY_PATH = "./DATA/";
    public static PRODUCTS_DATA_PATH = this.DATA_DIRECTORY_PATH + "products.json";
    public static USER_DATA_PATH = this.DATA_DIRECTORY_PATH + "users.json";

    private static async setData(endpoint: string, filePath: string) {
        let fetchResponse: any = (await fetch(endpoint));
        FileUtils.writeFile_(
            filePath, 
            JSON.stringify(await fetchResponse.json())
        );
    }
    
    public static async setAllData(): Promise<void> {
        if (!await FileUtils.exists(this.PRODUCTS_DATA_PATH) && !await FileUtils.exists(this.USER_DATA_PATH)) {
            FileUtils.createDirectory_(this.DATA_DIRECTORY_PATH);
            await this.setData('https://fakestoreapi.com/products', this.PRODUCTS_DATA_PATH);
            await this.setData('https://fakestoreapi.com/users', this.USER_DATA_PATH);
        }
    }
}