import express from "express";
import {
  aboutMe,
  signIn,
  signOut,
  signUp,
} from "../../../controllers/admin/auth.controller.js";
import { isAuthenticated } from "../../../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.get("/sign-out", signOut);

authRouter.get("/me", isAuthenticated, aboutMe);

export default authRouter;
