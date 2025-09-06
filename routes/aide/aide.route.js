import express from "express";
import {
  createAide,
  createAides,
  deleteAide,
  deleteAides,
  getAide,
  getAides,
  updateAide,
  getAvailableAides
} from "../../controllers/aide/aide.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";
const aideRouter = express.Router();

// route : /api/v1/admin/aide/

aideRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  createAide
);
aideRouter.post(
  "/aides",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  createAides
);
aideRouter.get(
  "/available",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  getAvailableAides
);

// Singles
aideRouter.get(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  getAide
);

aideRouter.put(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  updateAide
);

aideRouter.delete(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  deleteAide
);

// Multiples
aideRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  getAides
);

aideRouter.delete(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  deleteAides
);

export default aideRouter;
