import { Application } from "express";
import { App } from "./absApp";

let application: Application | undefined;

(async () => {
    await App.getInstance().then((rep) => {
        if (rep) application = rep.start();
    })
})();

export default application;