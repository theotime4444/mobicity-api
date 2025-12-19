import {Router} from 'express';
import v1Router from "./v1/index.js";
import chalk from "chalk";

const router = Router();

router.use("/v1", v1Router);
router.use("/", v1Router);

router.use((req, res) => {
    console.error(chalk.red.bold('[ROUTES] Bad URL:'), req.path);
    return res.status(404).send("Il ne s'agit pas d'une URL prise en charge par l'application");
});

export default router;
