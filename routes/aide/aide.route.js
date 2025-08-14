import express from "express";
import {
  createAide,
  createAides,
  deleteAide,
  deleteAides,
  getAide,
  getAides,
  updateAide,
} from "../../controllers/aide/aide.controller.js";

const aideRouter = express.Router();

// route : /api/v1/admin/aide/

aideRouter.post("/", createAide);
aideRouter.post("/bulk", createAides);

// Singles
aideRouter.get("/:id", getAide);

aideRouter.put("/:id", updateAide);

aideRouter.delete("/:id", deleteAide);

// Multiples
aideRouter.get("/", getAides);
aideRouter.delete("/", deleteAides);

export default aideRouter;
