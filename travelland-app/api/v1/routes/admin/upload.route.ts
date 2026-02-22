import { Router } from "express";
import multer from "multer";

import * as controller from "../../controller/admin/upload.controller"

const router: Router = Router();

import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
const upload = multer();

router.post(
  "/",
  upload.single("file"),
  uploadCloud.uploadSingle,
  controller.index
);

export const uploadRoutes: Router = router;
