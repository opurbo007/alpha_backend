import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const routeDocsGlob = (extension: "ts" | "js") =>
  path.join(__dirname, `../routes/*.${extension}`).replace(/\\/g, "/");

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "alpha Life API",
      version: "1.0.0",
      description: "Full backend API for alpha Life productivity app",
    },
    servers: [
      { url: "http://localhost:5001/api", description: "Development server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [routeDocsGlob("ts"), routeDocsGlob("js")],
};

export const swaggerSpec = swaggerJsdoc(options);
