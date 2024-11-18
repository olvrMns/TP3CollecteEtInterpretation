import { Application } from "express";
import { App } from "./AbsApp";

let application: Application | undefined;

(async () => {
    await App.getInstance().then((rep) => {
        if (rep) application = rep.start();
    })
})();

export default application;