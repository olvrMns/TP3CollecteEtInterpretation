import { Application } from "express";
import supertest from "supertest";
import { App } from "../absApp";
//import { assert, expect, should } from "chai"; //ts file bug

let appInstance: App | undefined;
let expressApplication: Application | undefined;
let adminToken: string | undefined;
let regUserToken: string | undefined;
let adminUser = {username: "morrison@gmail.com",password: "83r5^_"};
let regUser = {username: "oli",password: "83wafawfawfaBfw+a$$44f_"};
let product = {
    title: "salut",
    price: 5.68,
    description: "A afawonfawon fauf afouwab fwabf awubf aufb awuf bafauwjfbaibag ouahg; ag",
    image: "...",
    category: "slt",
    stock: 50,
    rating: {
        "rate": 5.99,
        "count": 500
    }
}

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
            .then((response) => {
                console.log(response.status)
                done()
            })
            .catch((error) => done(error))
        })
        
    })

    describe("Products", () => {

        it("Get All Products", (done) => {
            supertest(expressApplication as Application)
            .get("/v2/product/")
            .set('Authorization', `Bearer ${regUserToken}`)
            .expect(200)
            .then((response) => {
                done()
            })
            .catch((error) => done(error))
        })

        it("Save one product [Admin]", (done) => {
            supertest(expressApplication as Application)
            .post("/v2/product/save")
            .set('Authorization', `Bearer ${adminToken}`)
            .send(product)
            .expect(201)
            .then((response) => {
                console.log(response.status)
                done()
            })
            .catch((error) => done(error))
        })

        it("Save one product [RegUser] - Should return 401", (done) => {
            supertest(expressApplication as Application)
            .post("/v2/product/save")
            .set('Authorization', `Bearer ${regUserToken}`)
            .send(product)
            .expect(401)
            .then((response) => {
                console.log(response.status)
                done()
            })
            .catch((error) => done(error))
        })

        it("Delete one product", (done) => {
            supertest(expressApplication as Application)
            .post("/v2/product/remove/att=title&v=salut")
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)
            .then((response) => {
                console.log(response.status)
                done()
            })
            .catch((error) => done(error))
        })

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