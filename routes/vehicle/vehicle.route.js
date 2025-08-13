import express from "express";
import {
  createVehicle,
  deleteVehicle,
  deleteVehicles,
  getVehicle,
  getVehicles,
  updateVehicle,
} from "../../controllers/vehicle/vehicle.controller.js";

const vehicleRouter = express.Router();

vehicleRouter.post("/", createVehicle);
vehicleRouter.get("/", getVehicles);
vehicleRouter.get("/:id", getVehicle);
vehicleRouter.delete("/:id", deleteVehicle);
vehicleRouter.delete("/", deleteVehicles);
vehicleRouter.put("/:id", updateVehicle);

export default vehicleRouter;
