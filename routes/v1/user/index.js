import {Router} from 'express';
import userRouter from "./user.js";
import favoriteRouter from "./favorite.js";

const router = Router();

router.use("/users", userRouter);
router.use("/favorites", favoriteRouter);

export default router;

