import { catchAsyncErrors } from "./async_errors.middleware.js";
import { createError } from "../utils/error.js";

export const isRoleAuthorized = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      throw createError("You are not authorized to access this resource", 403);
    }
  };
};

