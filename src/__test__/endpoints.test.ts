import Dotenv from "dotenv";
Dotenv.config({path: `${__dirname}/../.${process.env.NODE_ENV}.env`});
import app from '../app';

//expect(2 + 2).toBe(4);
describe("Endpoints Test", () => {

  describe("Authentication", () => {

    test("Admin login", async () => {
      // const res = await request(app).post("/v2/login").send({ "username": "morrison@gmail.com", "password": "83r5^_" })
      // expect(res).toBe();
    });
  
    test("User signup (oli)", async () => {
  
    });
  
    test("User login (oli)", async () => {
  
    });

  });

  describe("Products endpoints", () => {

    test("Get One", async () => {
    
    });
  
    test("Save one", async () => {
  
    });
    
    test("Products by category", async () => {
  
    });
  
    test("Products by stock attribute", async () => {
  
    });
    
    test("Products price range", async () => {
  
    });

  });

});

 