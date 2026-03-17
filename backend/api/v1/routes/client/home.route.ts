import { Router } from "express";
import * as controller from "../../controller/client/home.controller";

const router: Router = Router();

router.get("/home", controller.home);

export const homeRoutes: Router = router;