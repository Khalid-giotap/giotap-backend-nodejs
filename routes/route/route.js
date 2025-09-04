import express from "express";
import {
  createRoute,
  deleteRoute,
  getRoute,
  getRoutes,
  updateRoute,
  deleteRoutes,
  createRoutes,
  getAvailableRoutes
} from "../../controllers/route/route.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";

const routeRouter = express.Router();

routeRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized([
    "super-admin",
    "transport-admin",
  ]),
  createRoute
);
routeRouter.post(
  "/routes",
  isAuthenticated,
  isRoleAuthorized([
    "super-admin",
    "transport-admin"
  ]),
  createRoutes
);

routeRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized([
    "super-admin",
    "transport-admin",
    "school-admin",
    "site_manager",
  ]),
  getRoutes
);
routeRouter.get(
  "/available",
  isAuthenticated,
  isRoleAuthorized([
    "super-admin",
    "transport-admin",
  ]),
  getAvailableRoutes
);
routeRouter.get(
  "/:id",
  isAuthenticated,
  isRoleAuthorized([
    "super-admin",
    "transport-admin",
    "school-admin",
    "site_manager",
  ]),
  getRoute
);
routeRouter.put(
  "/:id",
  isAuthenticated,
  isRoleAuthorized([
    "super-admin",
    "transport-admin",
    "school-admin",
    "site_manager",
  ]),
  updateRoute
);

routeRouter.delete(
  "/:id",
  isAuthenticated,
  isRoleAuthorized([
    "super-admin",
    "transport-admin",
    "school-admin",
    "site_manager",
  ]),
  deleteRoute
);
routeRouter.delete(
  "/",
  isAuthenticated,
  isRoleAuthorized([
    "super-admin",
    "transport-admin",
    "school-admin",
    "site_manager",
  ]),
  deleteRoutes
);

export default routeRouter;
