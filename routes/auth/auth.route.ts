import { Request, Response, Router } from "express";

const authRouter = Router();

// @params / GET /auth/sign-in
// @desc Sign in route
// @access Public

authRouter.post("/sign-up", (req: Request, res: Response) => {
  res.send("Signing up");
});

authRouter.post("/sign-in", (req: Request, res: Response) => {
  res.send("Signing in");
});

authRouter.get("/sign-out", (req: Request, res: Response) => {
  res.send("Signing out");
});

export default authRouter