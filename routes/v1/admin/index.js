import {Router} from 'express';
import {checkJWT} from "../../../middleware/identification/jwt.js";
import {admin} from "../../../middleware/authorization/mustBe.js";
import userRouter from "./user.js";
import categoryRouter from "./category.js";
import vehicleRouter from "./vehicle.js";
import transportLocationRouter from "./transportLocation.js";
import favoriteRouter from "./favorite.js";

const router = Router();

// Protection globale : toutes les routes /v1/admin/* nécessitent checkJWT + admin
router.use(checkJWT);
router.use(admin);

router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/vehicles", vehicleRouter);
router.use("/transport-locations", transportLocationRouter);
router.use("/favorites", favoriteRouter);

export default router;

