import supertest from "supertest";
import { Application } from "express";
import { App } from "../absApp";
//import { assert, expect, should } from "chai"; //ts file bug

const serv = async (): Promise<Application | undefined> => {
    let application: Application | undefined;
    await App.getInstance().then((response) => {
        application = response.start();
    })
    return application;
}

let application: Application | undefined;
let adminToken: string | undefined;
let regUserToken: string | undefined;

describe("Endpoints", () => {

    describe("Server", () => {

        it("Server init", async () => {
            application = await serv();
            supertest(application as Application)
            .get("/")
            .expect(200);
        })

    })

    describe("Authentication", () => {

        it("Admin login", async () => {
            supertest(application as Application)
            .post("/v2/login")
            .send({"username": "morrison@gmail.com","password": "83r5^_"})
            .expect(200)
            .then((response) => adminToken = response.text);
        })

        it("Reg User login", async () => {
            supertest(application as Application)
            .post("/v2/login")
            .send({"username": "oli","password": "83wafawfawfaBfw+a$$44f_"})
            .expect(200)
            .then((response) => regUserToken = response.text);
        })
        
    })

    // describe("Products", () => {

    //     it("Get All Products", async () => {

    //     })

    //     it("Get All Products", async () => {

    //     })

    //     it("Save one product", async () => {

    //     })

    //     it("Delete one product", async () => {

    //     })

    // })

})