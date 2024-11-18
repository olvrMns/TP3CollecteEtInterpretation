import Dotenv from "dotenv";
Dotenv.config({path: `${__dirname}/../.${process.env.NODE_ENV}.env`});
import { Request, Response } from 'supertest';
import mongoose from 'mongoose';

//expect(2 + 2).toBe(4);
describe("Endpoints Test", () => {

  describe("MongoDB", () => {
    test("Admin login", async () => {
      
    });
  });

  describe("Authentication", () => {

    test("Admin login", async () => {
      
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

 