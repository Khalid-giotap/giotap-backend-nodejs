import express from "express";
import {
  createVehicle,
  createVehicles,
  deleteVehicle,
  deleteVehicles,
  getAvailableVehicles,
  getVehicle,
  getVehicles,
  updateVehicle,
} from "../../controllers/vehicle/vehicle.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";

const vehicleRouter = express.Router();

vehicleRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  createVehicle
);
vehicleRouter.post(
  "/vehicles",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  createVehicles
);
vehicleRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  getVehicles
);
vehicleRouter.get(
  "/available",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  getAvailableVehicles
);
vehicleRouter.get(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site_manager"]),
  getVehicle
);
vehicleRouter.delete(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  deleteVehicle
);
vehicleRouter.delete(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  deleteVehicles
);
vehicleRouter.put(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  updateVehicle
);

export default vehicleRouter;
