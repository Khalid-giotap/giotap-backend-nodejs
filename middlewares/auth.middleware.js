import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { catchAsyncErrors } from "./async_errors.middleware.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies.token;
  if (!token)
    res.status(401).json({
      success: false,
      message: "Unauthorized!",
    });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await Admin.findById(decoded.userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized!",
    });
  }
  req.user = user;
  next();
});
