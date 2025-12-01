import {Router} from 'express';
import {checkJWT} from "../../../middleware/identification/jwt.js";
import userRouter from "./user.js";
import favoriteRouter from "./favorite.js";

const router = Router();

router.use(checkJWT);

router.use("/users", userRouter);
router.use("/favorites", favoriteRouter);

export default router;

