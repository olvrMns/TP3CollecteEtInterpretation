import Dotenv from "dotenv";
import Express, { Application } from "express";
import { Server } from "http";
import { FakeStore } from "./utils/fakeStore";
import { LogMessages } from "./utils/log/logMessages";
import { LOGGER } from "./utils/log/winstonLogger";
import { ProductService } from "./services/product.service";

/**
 * @ref
 * - https://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript
 * - https://github.com/keikaavousi/fake-store-api/tree/master/model
 */
export class App {

    private application: Application = Express();
    private server: Server | null = null;

    private App() {}

    public static async GetInstance(): Promise<App> {
        Dotenv.config({path: "./.env"});
        await FakeStore.setAllData();
        //console.log(await ProductService.addProduct({category: "slt", description: "slt", id: 25, image: "slt", price: 54, rating: {count: 5, rate: 5}, title: "slt"}));
        return new App();
    }

    public start(): void {
        this.server = this.application.listen(process.env.PORT, () => LOGGER.info(LogMessages.SERVER_START))
    }

    public close(): void {
        this.server?.close();
    }
}