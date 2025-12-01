import {Router} from 'express';
import v1Router from "./v1/index.js";

const router = Router();

// Versioning de l'API
router.use("/v1", v1Router);

// Redirection vers la dernière version par défaut
router.use("/", v1Router);

//Gestion d'une URL hors application
router.use((req, res) => {
    console.error(`Bad URL: ${req.path}`);
    return res.status(404).send("Il ne s'agit pas d'une URL prise en charge par l'application");
});

export default router;
