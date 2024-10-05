import Dotenv from "dotenv";
import Express, { Application } from "express";
import { Server } from "http";
import { FakeStore } from "./utils/fakeStore";
import { LogMessages } from "./utils/log/logMessages";
import { LOGGER } from "./utils/log/winstonLogger";
import { router as productRouter} from "./routes/product.route";
import { router as authRouter} from "./routes/auth.route";

/**
 * @ref
 * - https://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript
 * - https://github.com/keikaavousi/fake-store-api/tree/master/model
 * - https://stackoverflow.com/questions/11744975/enabling-https-on-express-js (https)
 * - https://stackoverflow.com/questions/58684642/should-i-call-dotenv-in-every-node-js-file
 */
export class App {

    private static instance: App | null = null;
    private application: Application = Express();
    private server: Server | null = null;
    private version: string = "/v1";

    private App() {}

    public static async getInstance(): Promise<App> {
        if (!this.instance) {
            Dotenv.config({path: "./.env"});
            await FakeStore.setAllData();
            this.instance = new App();
        }
        return this.instance;
    }

    public setRoutes() {
        this.application.use(Express.json());
        this.application.use(this.version, authRouter);
        this.application.use(this.version, productRouter);
    }

    public start(): void {
        this.server = this.application.listen(process.env.PORT, () => LOGGER.info(LogMessages.SERVER_START));
        this.setRoutes();
    }

    public close(): void {
        this.server?.close();
    }
}