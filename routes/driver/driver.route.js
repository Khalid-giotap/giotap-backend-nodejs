import express from "express";
import {
  createDriver,
  createDrivers,
  deleteDriver,
  getDriver,
  getDrivers,
  updateDriver,getAvailableDrivers
} from "../../controllers/driver/driver.controller.js";

import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";
const driverRouter = express.Router();

// Will create a driver with body
driverRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  createDriver
);
driverRouter.post(
  "/drivers",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  createDrivers
);

// returns the list of drivers
driverRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  getDrivers
);
// returns the list of drivers
driverRouter.get(
  "/available",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  getAvailableDrivers
);

// returns a single driver require id
driverRouter.get(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  getDriver
);

// Will update a driver with body require id
driverRouter.put(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  updateDriver
);

// Will delete a driver require id
driverRouter.delete(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  deleteDriver
);

export default driverRouter;
