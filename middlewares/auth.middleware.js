import jwt from "jsonwebtoken";

import Admin from "../models/admin.model.js";
import Aide from "../models/aide.model.js";
import Driver from "../models/driver.model.js";
import SiteManager from "../models/site-manger.model.js";

import { catchAsyncErrors } from "./async_errors.middleware.js";

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies.token;
  console.log(req.cookies);
  if (!token) {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split("Bearer ")[1];
      token = token.slice(0, token.length - 1);
      if (!token) {
        console.log(token, "token");
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  const user = await Admin.findById(decoded.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized!",
    });
  }
  req.user = user;
  next();
});
export const isAideAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies.token;
  console.log(req.cookies);
  if (!token) {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split("Bearer ")[1];
      token = token.slice(0, token.length - 1);
      if (!token) {
        console.log(token, "token");
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  const user = await Aide.findById(decoded.userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized!",
    });
  }
  req.user = user;
  next();
});
export const isDriverAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    console.log(token, "token");
    if (!token) {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        console.log(req.headers.authorization, "token");
        token = req.headers.authorization.split("Bearer ")[1];
        token = token.slice(0, token.length - 1);
        if (!token) {
          console.log(token, "token");
          return res.status(401).json({
            success: false,
            message: "Unauthorized!",
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await Driver.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    req.user = user;
    next();
  }
);
export const isSiteManagerAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    let token = req.cookies.token;
    console.log("token", token);
    if (!token) {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        console.log("token", req.headers.authorization);
        token = req.headers.authorization.split("Bearer ")[1];
        token = token.slice(0, token.length - 1);
        if (!token) {
          console.log(token, "token");
          return res.status(401).json({
            success: false,
            message: "Unauthorized!",
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await SiteManager.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    req.user = user;
    next();
  }
);
