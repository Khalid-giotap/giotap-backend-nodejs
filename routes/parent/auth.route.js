import express from "express";
import {
  aboutMe,
  changePassword,
  requestPasswordReset,
  resetPassword,
  signIn,
  signOut,
} from "../../controllers/parent/auth.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";

const parentAuthRouter = express.Router();

parentAuthRouter.post("/sign-in", signIn);
parentAuthRouter.get("/me", isAuthenticated, aboutMe);
parentAuthRouter.delete("/sign-out", signOut);
parentAuthRouter.put("/change-password", isAuthenticated, changePassword);
parentAuthRouter.post("/forgot-password", requestPasswordReset);
parentAuthRouter.put("/reset-password", resetPassword);

export default parentAuthRouter;
