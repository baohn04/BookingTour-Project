import { Router } from "express";
import multer from "multer";

import * as controller from "../../controller/admin/info-admin.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

const router: Router = Router();

router.patch(
  "/edit/",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.editPatch
);

export const infoAdminRoutes: Router = router;
