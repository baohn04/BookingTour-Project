import { Router } from "express";
import * as controller from "../../controller/client/cart.controller";

const router: Router = Router();

router.post("/list-json", controller.listJson);

export const cartRoutes: Router = router;