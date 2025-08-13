import express from "express";

import {
  aboutMe,
  signIn,
  signOut,
  signUp,
  changePassword,
  requestPasswordReset,
  resetPassword,
} from "../../controllers/admin/auth.controller.js";

import { isAdminAuthenticated } from "../../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.delete("/sign-out", signOut);

authRouter.get("/me", isAdminAuthenticated, aboutMe);

// Password
authRouter.put("/change-password", isAdminAuthenticated, changePassword);
authRouter.post("/forgot-password", requestPasswordReset);
authRouter.put("/reset-password", resetPassword);

export default authRouter;
