import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import Aide from "../models/aide.model.js";
import Driver from "../models/driver.model.js";
import SiteManager from "../models/site-manager.model.js";
import Mechanic from "../models/mechanic.model.js";
import Student from "../models/student.model.js";
import Parent from "../models/parent.model.js";
import { catchAsyncErrors } from "./async_errors.middleware.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized!",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  let user = null;
  const { id, role } = decoded;
  console.log(id, role);
  switch (role) {
    case "super-admin":
    case "transport-admin":
    case "school-admin":
      user = await Admin.findById(id);
      break;
    case "driver":
      user = await Driver.findById(id);
      break;
    case "aide":
      user = await Aide.findById(id);
      break;
    case "student":
      user = await Student.findById(id);
      break;
    case "parent":
      user = await Parent.findById(id);
      break;
    case "mechanic":
      user = await Mechanic.findById(id);
      break;
    case "site_manager":
      user = await SiteManager.findById(id);
      break;
    default:
      return res.status(401).json({ success: false, message: "Invalid role" });
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      data: { user: null },
      message: "User not found",
    });
  }

  req.user = { ...user.toObject(), role };
  next();
});
