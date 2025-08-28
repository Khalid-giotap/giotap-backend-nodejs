import express from "express";
import {
  addSchool,
  addSchools,
  getSchool,
  getSchools,
  deleteSchool,
  deleteSchools,getAvailableSchools
} from "../../controllers/school/school.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";

const schoolRouter = express.Router();

schoolRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  addSchool
);

schoolRouter.post(
  "/schools",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "site_manager", "transport-admin"]),
  addSchools
);

schoolRouter.get(
  "/available",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "site_manager", "transport-admin"]),
  getAvailableSchools
);

schoolRouter.get(
  "/:id",
  isAuthenticated,
  isRoleAuthorized([
    "school-admin",
    "super-admin",
    "site_manager",
    "transport-admin",
  ]),
  getSchool
);
schoolRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "site_manager", "transport-admin"]),
  getSchools
);
schoolRouter.delete(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin",]),
  deleteSchools
);
schoolRouter.delete(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  deleteSchool
);

export default schoolRouter;
