import { Router } from "express";
import multer from "multer";

import * as controller from "../../controller/admin/account-admin.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import * as validate from "../../../../validates/admin/admin.validate"

const upload = multer();

const router: Router = Router();

router.get("/", controller.index);

router.post(
  "/create",
  upload.single("avatar"),
  validate.createPost,
  uploadCloud.uploadSingle,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  validate.editPatch,
  uploadCloud.uploadSingle,
  controller.editPatch
);

router.delete("/delete/:id", controller.deleteItem);

router.patch("/change-status/:status/:id", controller.changeStatus);

export const accountAdminRoutes: Router = router;
