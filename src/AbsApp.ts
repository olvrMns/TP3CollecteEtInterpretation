import Dotenv from "dotenv";
Dotenv.config({path: "./.TEMP.env"});
import Express, { Application } from "express";
import { readFileSync } from 'fs';
import { Server } from "http";
import { Server as HTTPSServer, createServer } from "https";
import { serve, setup } from 'swagger-ui-express';
import { router as authRouter } from "./routes/auth.route";
import { router as productRouter } from "./routes/product.route";
import { config } from "./swagger";
import { FakeStore } from "./utils/fakeStore";
import { LogMessages } from "./utils/log/logMessages";
import { LOGGER } from "./utils/log/winstonLogger";
import { setMongoDBCluster } from "./utils/MongoDB";

/**
 * @ref
 * - https://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript
 * - https://github.com/keikaavousi/fake-store-api/tree/master/model
 * - https://stackoverflow.com/questions/11744975/enabling-https-on-express-js (https)
 * - https://stackoverflow.com/questions/58684642/should-i-call-dotenv-in-every-node-js-file
 */
export class App {

    public application: Application = Express();
    private httpServer: Server | null = null;
    private httpsServer: HTTPSServer | null = null;
    private version: string = "/v1";
    private documentationEndPoint: string = "/doc";

    private constructor() {}

    public static async getInstance(): Promise<App> {
        await FakeStore.setAllData();
        await setMongoDBCluster(String(process.env.MONGODB_URL_PROD), String(process.env.MONGODB_URL_DEV));
        return new App();
    }

    public setRoutes() {
        this.application.use(Express.json());
        this.application.use(this.version + this.documentationEndPoint, serve, setup(config, { explorer: true}));
        this.application.use(this.version, authRouter);
        this.application.use(this.version, productRouter);
    }

    public start(): void {
        this.httpsServer = this.httpsServer = createServer({
            key: readFileSync("./cert/privateKey.pem"),
            cert: readFileSync("./cert/publicKey.crt")
        }, this.application);
        this.httpsServer.listen(process.env.DEV_PORT, () => LOGGER.info(LogMessages.SERVER_START));
        //this.server = this.application.listen(process.env.PORT, () => LOGGER.info(LogMessages.SERVER_START));
        this.setRoutes();
    }

    public close(): void {
        this.httpServer?.close();
        this.httpsServer?.close();
    }
}