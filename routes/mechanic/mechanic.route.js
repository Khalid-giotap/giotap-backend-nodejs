import express from "express";
import {
  createMechanic,
  createMechanics,
  deleteMechanic,
  deleteMechanics,
  getMechanic,
  getMechanics,
  updateMechanic,
} from "../../controllers/mechanic/mechanic.controller.js";

const mechanicRouter = express.Router();

mechanicRouter.post("/", createMechanic);
mechanicRouter.post("/mechanics", createMechanics);
mechanicRouter.get("/:id", getMechanic);
mechanicRouter.put("/:id", updateMechanic);
mechanicRouter.delete("/:id", deleteMechanic);

mechanicRouter.get("/", getMechanics);
mechanicRouter.get("/", deleteMechanics);

export default mechanicRouter;
