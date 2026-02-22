import { Router } from "express";

import * as controller from "../../controller/admin/error.controller";

const router: Router = Router();

router.get("/404", controller.notFound);

export const errorRoutes: Router = router;