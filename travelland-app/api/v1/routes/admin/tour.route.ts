import { Router } from "express";
import multer from "multer";

import * as validate from "../../../../validates/admin/tour.validate";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import * as controller from "../../controller/admin/tour.controller";

const upload = multer();

const router: Router = Router();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.array("images", 10),
  validate.createPost,
  uploadCloud.uploadArray,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.array("images", 10),
  validate.editPatch,
  uploadCloud.uploadArray,
  controller.editPatch
);

// router.delete("/delete/:id", controller.deleteItem);

// router.patch("/change-status/:status/:id", controller.changeStatus);

export const tourRoutes: Router = router;
