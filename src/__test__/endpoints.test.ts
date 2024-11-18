jest.useFakeTimers();
import Dotenv from "dotenv";
Dotenv.config({path: `${__dirname}/../.${process.env.NODE_ENV}.env`});
import request from 'supertest';
import app from '../app';

describe("Endpoints Test", () => {

  describe("Authentication", () => {

    test("Admin login", async () => {
      const res = await request(app).post("/v2/login")
      .send({ "username": "oli", "password": "83wafawfawfaBfw+a$$44f_" })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      expect(res.statusCode).toBe(200);
    });
  
    // test("User signup (oli)", async () => {
  
    // });
  
    // test("User login (oli)", async () => {
  
    // });

  });

  // describe("Products endpoints", () => {

  //   test("Get One", async () => {
    
  //   });
  
  //   test("Save one", async () => {
  
  //   });
    
  //   test("Products by category", async () => {
  
  //   });
  
  //   test("Products by stock attribute", async () => {
  
  //   });
    
  //   test("Products price range", async () => {
  
  //   });

  // });

});

 