import express from "express";
import {
  createParent,
  createParents,
  deleteParent,
  deleteParents,
  getChild,
  getChildren,
  getParent,
  getParents,
  updateParent,
} from "../../controllers/parent/parent.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";

const parentRouter = express.Router();

//  Makes routes to get children of a parent

// Make routes to track children of the parent
parentRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "school-admin"]),
  createParent
);
parentRouter.post("/parents", isAuthenticated, isRoleAuthorized(["super-admin", "transport-admin", "school-admin"]), createParents);

parentRouter.get(
  "/children",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "school-admin"]),
  getChildren
);
parentRouter.get(
  "/children/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "school-admin"]),
  getChild
);

parentRouter.get(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "school-admin"]),
  getParent
);
parentRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "school-admin"]),
  getParents
);

parentRouter.put(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "school-admin"]),
  updateParent
);
parentRouter.delete(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "school-admin"]),
  deleteParent
);

parentRouter.delete(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "school-admin"]),
  deleteParents
);

// Children

export default parentRouter;
