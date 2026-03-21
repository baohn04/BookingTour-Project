import { Router } from "express";
import * as controller from "../../controller/client/tour.controller";

const router: Router = Router();

router.get("/", controller.review);

router.post("/", controller.reviewPost);

export const reviewRoutes: Router = router;
