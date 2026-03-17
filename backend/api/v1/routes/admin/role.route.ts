import { Router } from "express";
import * as controller from "../../controller/admin/role.controller";
import * as validate from "../../../../validates/admin/role.validate";
const router: Router = Router();

router.get("/", controller.index);

router.post("/create", validate.createPost, controller.createPost);

router.patch("/edit/:id", controller.editPatch);

router.get("/permissions", controller.permissions);

router.patch("/permissions", controller.permissionsPatch);

export const roleRoutes: Router = router;
