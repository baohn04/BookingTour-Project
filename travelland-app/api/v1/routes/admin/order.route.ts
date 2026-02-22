import { Router } from "express";
import * as controller from "../../controller/admin/order.controller";

const router: Router = Router();

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:status/:id", controller.changeStatus);

// router.delete("/delete/:id", controller.deleteOrder);

export const orderRoutes: Router = router;
