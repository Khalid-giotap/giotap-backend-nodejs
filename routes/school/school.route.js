import express from "express";
import {
  addSchool,
  addSchools,
  getSchool,
  getSchools,
  deleteSchool,
  deleteSchools,
} from "../../controllers/school/school.controller.js";
import { isAdminAuthenticated } from "../../middlewares/auth.middleware.js";

const schoolRouter = express.Router();

schoolRouter.post("/add", addSchool);
schoolRouter.post("/bulk", isAdminAuthenticated, addSchools);
schoolRouter.get("/:id", getSchool);
schoolRouter.get("/", getSchools);
schoolRouter.delete("/", deleteSchools);
schoolRouter.delete("/:id", deleteSchool);

export default schoolRouter;
