import swaggerJSDoc from "swagger-jsdoc";

/**
 * @ref
 * - https://blog.logrocket.com/documenting-express-js-api-swagger/
 */
const swaggerConfig: any = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Fake Product API",
        version: "0.1.0",
        description: "MV - Collecte et interprétation"
      },
      servers: [ { url: "http://localhost:5555" } ],
    },
    apis: ["./src/routes/*.js"],
};

export const config: object = swaggerJSDoc(swaggerConfig);

