import { App } from "./absApp";

let app: App | undefined;

(async () => {
    app = await App.getInstance();
    app.start();
})();

export default app?.application;