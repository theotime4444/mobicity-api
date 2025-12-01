import {default as swaggerJSDoc} from "swagger-jsdoc";
import * as fs from "node:fs";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mobicity API - Smart City", // Title (required)
            version: "1.0.0", // Version (required)
            description: "API pour le projet Smart City - Localisation de points de transport en commun"
        },
        servers: [
            {
                url: "http://localhost:3001",
                description: "Serveur de développement"
            }
        ]
    },
    // Path to the API docs
    apis: [
        "./swagger/components.js",
        "./controler/**/*.js",
        "./middleware/**/*.js",
        "./model/**/*.js",
        "./routes/**/*.js",
    ],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
fs.writeFileSync("./swagger/spec.json", JSON.stringify(swaggerSpec, null, 2));
console.log("Documentation Swagger générée avec succès dans ./swagger/spec.json");

