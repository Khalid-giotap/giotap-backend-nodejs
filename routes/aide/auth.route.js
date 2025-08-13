import express from "express";
import {
  signIn,
  aboutMe,
  signOut,
  changePassword,
  resetPassword,
  requestPasswordReset,
} from "../../controllers/aide/auth.controller.js";
import { isAideAuthenticated } from "../../middlewares/auth.middleware.js";

const authRouter = express.Router();

// Auth
authRouter.post("/sign-in", signIn);
authRouter.get("/me", isAideAuthenticated, aboutMe);
authRouter.delete("/sign-out", signOut);

// Password
authRouter.put("/change-password", isAideAuthenticated, changePassword);
authRouter.post("/forgot-password", requestPasswordReset);
authRouter.put("/reset-password", resetPassword);

export default authRouter;
