import { Router } from "express";
import * as controller from "../../controller/admin/auth.controller";
import * as validate from "../../../../validates/admin/auth.validate";

const router: Router = Router();

router.post("/login", validate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.post("/password/forgot", validate.forgotPasswordPost, controller.forgotPasswordPost);

router.post("/password/otp", controller.otpPasswordPost);

router.post("/password/reset", validate.resetPasswordPost, controller.resetPasswordPost);

export const authRoutes: Router = router;