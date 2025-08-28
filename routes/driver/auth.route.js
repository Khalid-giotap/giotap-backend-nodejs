import express from "express";
import {
  aboutMe,
  requestPasswordReset,
  resetPassword,
  changePassword,
  signIn,
  signOut,
} from "../../controllers/driver/auth.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
const driverAuthRouter = express.Router();

//
driverAuthRouter.post("/sign-in", signIn);

driverAuthRouter.get("/me", isAuthenticated, aboutMe);

driverAuthRouter.delete("/sign-out", signOut);

// Passwords
driverAuthRouter.put("/change-password", isAuthenticated, changePassword);
driverAuthRouter.post("/forgot-password", requestPasswordReset);
driverAuthRouter.put("/reset-password", resetPassword);

export default driverAuthRouter;
