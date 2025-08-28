import express from "express";
import {
  signIn,
  aboutMe,
  signOut,
  changePassword,
  resetPassword,
  requestPasswordReset,
} from "../../controllers/aide/auth.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";

const authRouter = express.Router();

// Auth
authRouter.post("/sign-in", signIn);
authRouter.get("/me", isAuthenticated, aboutMe);
authRouter.delete("/sign-out", signOut);

// Password
authRouter.put("/change-password", isAuthenticated, changePassword);
authRouter.post("/forgot-password", requestPasswordReset);
authRouter.put("/reset-password", resetPassword);

export default authRouter;
