import {Router} from 'express';
import authRouter from "./auth.js";
import publicRouter from "./public/index.js";
import userRouter from "./user/index.js";
import adminRouter from "./admin/index.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/", publicRouter);
router.use("/", userRouter);
router.use("/admin", adminRouter);

export default router;

