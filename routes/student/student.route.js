import express from "express";
import { addStudent,getStudents,addStudents } from "../../controllers/student/student.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";

const studentRouter = express.Router();

studentRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "school-admin"]),
  addStudent
);

studentRouter.post(
  "/students",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "school-admin"]),
  addStudents
);

studentRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "school-admin"]),
  getStudents
);

export default studentRouter;
