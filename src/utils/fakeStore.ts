import { FileUtils } from "./FileUtils";
import { LogMessages } from "./log/LogMessages";

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
        FileUtils.writeToFile(
            filePath, 
            JSON.stringify(await fetchResponse.json()), 
            LogMessages.FAKE_STORE_DATA_FILE_SUCCESS, 
            LogMessages.FAKE_STORE_DATA_FILE_ERROR
        );
    }
    
    public static async setAllData(): Promise<void> {
        FileUtils.createDirectory(this.DATA_DIRECTORY_PATH);
        await this.setData('https://fakestoreapi.com/products', this.PRODUCTS_DATA_PATH);
        await this.setData('https://fakestoreapi.com/users', this.USER_DATA_PATH);
    }
}