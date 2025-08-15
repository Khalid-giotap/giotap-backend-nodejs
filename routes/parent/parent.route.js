import express from "express";
import {
  createParent,
  createParents,
  deleteParent,
  deleteParents,
  getParent,
  getParents,
  updateParent,
} from "../../controllers/parent/parent.controller.js";

const parentRouter = express.Router();

parentRouter.post("/", createParent);
parentRouter.post("/parents", createParents);

parentRouter.get("/:id", getParent);
parentRouter.get("/", getParents);

parentRouter.put("/:id", updateParent);

parentRouter.delete("/:id", deleteParent);
parentRouter.put("/", deleteParents);

export default parentRouter;
