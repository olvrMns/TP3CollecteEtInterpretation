import supertest from "supertest";
import { Application } from "express";
import { App } from "../absApp";
import { Server } from "https";
//import { assert, expect, should } from "chai"; //ts file bug

const serv = async (): Promise<Application | undefined> => {
    let application: Application | undefined;
    await App.getInstance().then((response) => {
        application = response.start();
    })
    return application;
}

let expressApplication: Application | undefined;
let adminToken: string | undefined;
let regUserToken: string | undefined;
let adminUser = {username: "morrison@gmail.com",password: "83r5^_"};
let regUser = {username: "oli",password: "83wafawfawfaBfw+a$$44f_"};

describe("Endpoints", () => {

    after(() => {
        
    })

    describe("Server", () => {

        it("Server init", async () => {
            expressApplication = await serv();
            supertest(expressApplication as Application)
            .get("/")
            .expect(200);
        })

    })

    describe("Authentication", () => {

        it("Admin login", async () => {
            supertest(expressApplication as Application)
            .post("/v2/login")
            .send(adminUser)
            .expect(200)
            .then((response) => adminToken = response.text);
        })

        it("Reg User login", async () => {
            supertest(expressApplication as Application)
            .post("/v2/login")
            .send(regUser)
            .expect(200)
            .then((response) => regUserToken = response.text);
        })
        
    })

    describe("Products", () => {

        it("Get All Products", async () => {
            supertest(expressApplication as Application)
            .get("/v2/product/")
            .set('Authorization', `Bearer ${regUserToken}`)
            .expect(200)
            .then((response) => {
                console.log(response)
            })
        })

        // it("Get All Products", async () => {
        //     supertest(expressApplication as Application)
        // })

        // it("Save one product", async () => {
        //     supertest(expressApplication as Application)
        // })

        // it("Delete one product", async () => {
        //     supertest(expressApplication as Application)
        // })

        // it("Products by range", async () => {
        //     supertest(expressApplication as Application)
        // })

        // it("Products by stock", async () => {
        //     supertest(expressApplication as Application)
        // })

        // it("Products by price", async () => {
        //     supertest(expressApplication as Application)
        // })

        // it("Products by category", async () => {
        //     supertest(expressApplication as Application)
        // })

    })

})