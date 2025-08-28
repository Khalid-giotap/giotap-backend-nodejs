import express from "express";
import {
  signIn,
  signOut,
  resetPassword,
  changePassword,
  requestPasswordReset,
  aboutMe,
} from "../../controllers/site-manager/auth.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
const managerAuthRouter = express.Router();

managerAuthRouter.post("/sign-in", signIn);
managerAuthRouter.get("/me", isAuthenticated, aboutMe);
managerAuthRouter.delete("/sign-out", signOut);

managerAuthRouter.put(
  "/change-password",
  isAuthenticated,
  changePassword
);

managerAuthRouter.post("/forgot-password", requestPasswordReset);
managerAuthRouter.put("/reset-password", resetPassword);

export default managerAuthRouter;
