import { config } from "dotenv";
import Express, { Application, Request, Response } from "express";

config({path: "./.env"});
const app: Application = Express();

app.get("/", (request: Request, response: Response) => {
    response.send("slt");
});

app.listen(process.env.PORT, () => {
    console.log("oui")
});