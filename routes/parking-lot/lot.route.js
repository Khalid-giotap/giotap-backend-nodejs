import express from "express";
import {
  createParkingLot,
  getParkingLots,
  getEmptyParkingLots,
  getParkingLot,
  updateParkingLot,
  deleteParkingLot,
  deleteParkingLots,
} from "../../controllers/parking-lot/lot.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";
const lotRouter = express.Router();

lotRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site-manager"]),
  createParkingLot
);
lotRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site-manager"]),
  getParkingLots
);
lotRouter.delete("/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site-manager"]),
  deleteParkingLots
);
lotRouter.get(
  "/empty",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site-manager"]),
  getEmptyParkingLots
);

lotRouter.get(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site-manager"]),
  getParkingLot
);
lotRouter.put(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site-manager"]),
  updateParkingLot
);
lotRouter.delete("/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin", "site-manager"]),
  deleteParkingLot
);

export default lotRouter;
