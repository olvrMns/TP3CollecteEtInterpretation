import Dotenv from "dotenv";
import Express, { Application, Request, Response } from "express";
import { createLoggingFileStructure } from "./utils/log/LogFileCreate";
import { LOGGER } from "./utils/log/WinstonLogger";
import { Server } from "http";
import { LogMessages } from "./utils/log/LogMessages";

/**
 * @ref
 * - https://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript
 */
export class App {

    private application: Application = Express();
    private server: Server | null = null;

    private App() {
        createLoggingFileStructure();
        Dotenv.config({path: "./.env"});
    }

    public static GetInstance(): App {
        return new App();
    }

    public start(): void {
        this.server = this.application.listen(process.env.PORT, () => LOGGER.info(LogMessages.SERVER_START))
    }

    public close(): void {
        this.server?.close();
    }
}