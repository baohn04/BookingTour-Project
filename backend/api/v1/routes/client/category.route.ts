import { Router } from "express";
import * as controller from "../../controller/client/category.controller";

const router: Router = Router();

router.get("/", controller.index);

export const categoryRoutes: Router = router;