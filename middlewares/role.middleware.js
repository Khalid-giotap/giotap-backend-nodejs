import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { catchAsyncErrors } from "./async_errors.middleware.js";

export const isSuperAdmin = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "super_admin") {
    throw Error("You are not authorized to access this resource");
  } else {
    next();
  }
});

export const isTransportAdmin = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "transport_admin") {
    throw Error("You are not authorized to access this resource");
  } else {
    next();
  }
});

export const isSchoolAdmin = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "transport_admin") {
    throw Error("You are not authorized to access this resource");
  } else {
    next();
  }
});
