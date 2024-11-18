import supertest from "supertest";
import { Application } from "express";
import { App } from "../absApp";
import { expect } from "chai";

const serv = async (): Promise<Application | undefined> => {
    let application: Application | undefined;
    await App.getInstance().then((response) => {
        application = response.start();
    })
    return application;
}

describe("Endpoints", () => {

    describe("Server", () => {

        it("Server init", async () => {
            let application = await serv();
            expect(application).to.be.not("undefined");
        })

    })


    // describe("Authentication", () => {

        
    // })

})