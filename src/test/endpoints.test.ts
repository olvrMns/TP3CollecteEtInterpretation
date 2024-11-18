import supertest from "supertest";
import { Application } from "express";
import { App } from "../absApp";
import { Server } from "https";
//import { assert, expect, should } from "chai"; //ts file bug

let appInstance: App | undefined;
let expressApplication: Application | undefined;
let adminToken: string | undefined;
let regUserToken: string | undefined;
let adminUser = {username: "morrison@gmail.com",password: "83r5^_"};
let regUser = {username: "oli",password: "83wafawfawfaBfw+a$$44f_"};

describe("Endpoints", () => {

    describe("Server", () => {

        it("Server init", async () => {
            appInstance = await App.getInstance();
            expressApplication = appInstance.start()
            supertest(expressApplication as Application)
            .get("/")
            .expect(200);
        })

    })

    describe("Authentication", () => {

        it("Admin login", (done) => {
            supertest(expressApplication as Application)
            .post("/v2/login")
            .send(adminUser)
            .expect(200)
            .then((response) => {
                adminToken = response.text;
                done();
            })
            .catch((error) => done(error))
        })

        it("Reg User login", (done) => {
            supertest(expressApplication as Application)
            .post("/v2/login")
            .send(regUser)
            .expect(200)
            .then((response) => {
                regUserToken = response.text;
                done();
            })
            .catch((error) => done(error))
        })

        it("Invalid authentication", (done) => {
            supertest(expressApplication as Application)
            .post("/v2/login")
            .send({username: "morrison@gmail.com",password: "..."})
            .expect(401)
            .then((response) => done("???"))
            .catch((error) => done())
        })
        
    })

    describe("Products", () => {

        it("Get All Products", (done) => {
            supertest(expressApplication as Application)
            .get("/v2/product/")
            .set('Authorization', `Bearer ${regUserToken}`)
            .expect(200)
            .then((response) => {done()})
            .catch((error) => done(error))
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