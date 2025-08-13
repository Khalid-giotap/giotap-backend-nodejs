import express from "express";
import {
  signIn,
  signOut,
  aboutMe,
  changePassword,
  requestPasswordReset,
  resetPassword,
} from "../../controllers/mechanic/auth.controller.js";

const mechanicAuthRouter = express.Router();

mechanicAuthRouter.post("/sign-in", signIn);
mechanicAuthRouter.delete("/sign-out", signOut);
mechanicAuthRouter.get("/me", aboutMe);

mechanicAuthRouter.put("/change-password", changePassword);
mechanicAuthRouter.post("/forgot-password", requestPasswordReset);
mechanicAuthRouter.put("/reset-password", resetPassword);

export default mechanicAuthRouter;
