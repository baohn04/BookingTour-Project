import { Express } from 'express';
import { categoryRoutes } from './category.route';
import { cartRoutes } from './cart.route';
import { orderRoutes } from './order.route';
import { homeRoutes } from './home.route';
import { tourRoutes } from './tour.route';

const clientV1Routes = (app: Express): void => {
  const version = "/api/v1";

  app.use(version + "/", homeRoutes);

  app.use(version + "/tours", tourRoutes);

  app.use(version + "/categories", categoryRoutes);

  app.use(version + "/cart", cartRoutes);

  app.use(version + "/order", orderRoutes);
}

export default clientV1Routes;