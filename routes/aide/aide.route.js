import express from "express";
import { createAide, deleteAide, deleteAides, getAide, getAides, updateAide } from "../../controllers/aide/aide.controller.js";


const aideRouter = express.Router();

// route : /api/v1/admin/aide/

aideRouter.post("/", createAide);

// Singles
aideRouter.get("/:id", getAide);

aideRouter.put("/:id", updateAide);

aideRouter.delete("/:id", deleteAide);

// Multiples
aideRouter.get("/", getAides);
aideRouter.delete("/", deleteAides);


export default aideRouter;
