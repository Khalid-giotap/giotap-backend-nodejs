import express from "express";
import {
  createRoute,
  deleteRoute,
  getRoute,
  getRoutes,
  updateRoute,
  deleteRoutes,
  createRoutes
} from "../../controllers/route/route.controller.js";

const routeRouter = express.Router();

routeRouter.post("/", createRoute);
routeRouter.post("/routes", createRoutes);

routeRouter.get("/", getRoutes);
routeRouter.get("/:id", getRoute);
routeRouter.put("/:id", updateRoute);

routeRouter.delete("/:id", deleteRoute);
routeRouter.delete("/", deleteRoutes);

export default routeRouter;
