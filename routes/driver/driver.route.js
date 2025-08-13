import express from "express";
import {
  createDriver,
  deleteDriver,
  getDriver,
  getDrivers,
  unAssignDriver,
  updateDriver,
} from "../../controllers/driver/driver.controller.js";

const driverRouter = express.Router();

// Will create a driver with body
driverRouter.post("/", createDriver);

// returns the list of drivers
driverRouter.get("/", getDrivers);

// returns a single driver require id
driverRouter.get("/:id", getDriver);

// Will update a driver with body require id
driverRouter.put("/:id", updateDriver);

// Will delete a driver require id
driverRouter.delete("/:id", deleteDriver);
driverRouter.delete("/unassign/:id", unAssignDriver);

export default driverRouter;
