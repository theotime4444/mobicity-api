import {Router} from 'express';
import authRouter from "./auth.js";
import publicRouter from "./public/index.js";
import userRouter from "./user/index.js";
import adminRouter from "./admin/index.js";

const router = Router();

// Routes d'authentification (publiques)
router.use("/auth", authRouter);

// Routes publiques (lecture seule)
router.use("/", publicRouter);

// Routes utilisateur (checkJWT requis)
router.use("/", userRouter);

// Routes admin (checkJWT + admin requis)
router.use("/admin", adminRouter);

export default router;

