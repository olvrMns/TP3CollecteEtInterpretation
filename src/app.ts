import { config } from "dotenv";
import Express, { Application, Request, Response } from "express";
import { createLoggingFileStructure } from "./utils/log/LogFileCreate";
import { LOGGER } from "./utils/log/WinstonLogger";
import { Server } from "http";

createLoggingFileStructure();
config({path: "./.env"});
const app: Application = Express();

app.get("/", (request: Request, response: Response) => {
    response.send("slt");
});

var serv: Server = app.listen(process.env.PORT, () => LOGGER.info("Server Start"));


