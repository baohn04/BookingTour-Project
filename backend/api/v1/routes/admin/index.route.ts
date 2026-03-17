import { Express } from "express";
import { systemConfig } from "../../../../config/system";
import { authRoutes } from "./auth.route";
import { dashboardRoutes } from "./dashboard.route";
import { categoryRoutes } from "./category.route";
import { tourRoutes } from "./tour.route";
// import { uploadRoutes } from "./upload.route";
import { orderRoutes } from "./order.route";
import { roleRoutes } from "./role.route";
import { accountAdminRoutes } from "./account-admin.route";
import { infoAdminRoutes } from "./info-admin.route";

import * as authController from "../../controller/admin/auth.controller";
import * as authMiddleware from "../../middlewares/admin/auth.middleware";
import { settingGeneralRoutes } from "./setting.route";
import { errorRoutes } from "./error.route";

const adminV1Routes = (app: Express): void => {
  const version = "/api/v1";
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.get(version + `/${PATH_ADMIN}`, authController.loginPost);

  app.use(version + `/${PATH_ADMIN}/auth`, authRoutes);

  app.use(version + `/${PATH_ADMIN}/dashboard`, authMiddleware.requireAuth, dashboardRoutes);

  app.use(version + `/${PATH_ADMIN}/categories`, authMiddleware.requireAuth, categoryRoutes);

  app.use(version + `/${PATH_ADMIN}/tours`, authMiddleware.requireAuth, tourRoutes);

  app.use(version + `/${PATH_ADMIN}/orders`, authMiddleware.requireAuth, orderRoutes);

  app.use(version + `/${PATH_ADMIN}/roles`, authMiddleware.requireAuth, roleRoutes);

  app.use(version + `/${PATH_ADMIN}/account-admin`, authMiddleware.requireAuth, accountAdminRoutes);

  app.use(version + `/${PATH_ADMIN}/info-admin`, authMiddleware.requireAuth, infoAdminRoutes);

  app.use(version + `/${PATH_ADMIN}/setting`, settingGeneralRoutes);

  app.use(version + `/${PATH_ADMIN}/error`, errorRoutes);

};

export default adminV1Routes;