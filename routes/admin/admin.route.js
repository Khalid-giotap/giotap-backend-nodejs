import express from "express";

import {
  createAdmin,
  deleteAdmin,
  deleteAdmins,
  updateAdmin,
  getAdmin,
  getAdmins,
  createAdmins,
} from "../../controllers/admin/admin.controller.js";

import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";

const authRouter = express.Router();

authRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  createAdmin
);
authRouter.post(
  "/admins",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  createAdmins
);

// Singles require /:id
authRouter.get(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  getAdmin
);
authRouter.put(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  updateAdmin
);
authRouter.delete(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  deleteAdmin
);

// Multiples
authRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  getAdmins
);
authRouter.delete(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  deleteAdmins
);

export default authRouter;
