import express from "express";
import {default as Router} from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
import {default as swaggerJSDoc} from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

// Générer automatiquement la spécification Swagger au démarrage
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mobicity API - Smart City",
            version: "1.0.0",
            description: "API pour le projet Smart City - Localisation de points de transport en commun"
        },
        servers: [
            {
                url: "http://localhost:3001",
                description: "Serveur de développement"
            }
        ]
    },
    apis: [
        join(__dirname, "./swagger/components.js"),
        join(__dirname, "./controler/**/*.js"),
        join(__dirname, "./middleware/**/*.js"),
        join(__dirname, "./model/**/*.js"),
        join(__dirname, "./routes/**/*.js"),
    ],
};

let swaggerSpec;
try {
    // Générer la documentation Swagger
    swaggerSpec = swaggerJSDoc(swaggerOptions);
    console.log("✅ Documentation Swagger générée avec succès");
} catch (err) {
    console.error("❌ Erreur lors de la génération de la documentation Swagger:", err);
    swaggerSpec = {};
}

// Configuration Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Mobicity API - Documentation"
}));

app.use(express.json());
app.use(Router);

app.listen(port, '0.0.0.0', () => {
    console.log(`http://localhost:${port}`);
});

