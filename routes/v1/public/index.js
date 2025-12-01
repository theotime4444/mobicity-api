import {Router} from 'express';
import categoryRouter from "./category.js";
import vehicleRouter from "./vehicle.js";
import transportLocationRouter from "./transportLocation.js";

const router = Router();

router.use("/categories", categoryRouter);
router.use("/vehicles", vehicleRouter);
router.use("/transport-locations", transportLocationRouter);

export default router;

