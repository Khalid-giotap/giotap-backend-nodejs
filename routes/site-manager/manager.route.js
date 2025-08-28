import express from "express";
import {
  createSiteManager,
  getSiteManager,
  updateSiteManager,
  deleteSiteManager,
  deleteSiteManagers,
  getSiteManagers,
  createSiteManagers,
} from "../../controllers/site-manager/manager.controller.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";

const managerRouter = express.Router();

// Singles required /:id
managerRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  createSiteManager
);
managerRouter.post(
  "/managers",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  createSiteManagers
);

managerRouter.get(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  getSiteManager
);
managerRouter.put(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  updateSiteManager
);
managerRouter.delete(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  deleteSiteManager
);

// Multiples
managerRouter.delete(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  deleteSiteManagers
);
managerRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  getSiteManagers
);

export default managerRouter;
