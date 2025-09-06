import express from "express";
import {
  createMechanic,
  createMechanics,
  deleteMechanic,
  deleteMechanics,
  getMechanic,
  getMechanics,
  updateMechanic,
  getAvailableMechanics
} from "../../controllers/mechanic/mechanic.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";

const mechanicRouter = express.Router();

mechanicRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  createMechanic
);

mechanicRouter.post(
  "/mechanics",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  createMechanics
);

mechanicRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  getMechanics
);

mechanicRouter.get(
  "/available",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  getAvailableMechanics
);

mechanicRouter.get(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  getMechanic
);
mechanicRouter.put(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  updateMechanic
);
mechanicRouter.delete(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  deleteMechanic
);

mechanicRouter.delete(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  deleteMechanics
);

export default mechanicRouter;
