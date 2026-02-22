import { Router } from "express";
import multer from "multer";

import * as validate from "../../../../validates/admin/category.validate";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import * as controller from "../../controller/admin/category.controller";

const upload = multer();

const router: Router = Router();

router.get("/", controller.index);

router.post(
  "/create",
  upload.single("image"),
  validate.createPost,
  uploadCloud.uploadSingle,
  controller.createPost
);

router.patch(
  "/edit/:id",
  upload.single("image"),
  validate.editPatch,
  uploadCloud.uploadSingle,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

router.delete("/delete/:id", controller.deleteItem);

router.patch("/change-status/:status/:id", controller.changeStatus);

export const categoryRoutes: Router = router;
