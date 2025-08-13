import express from "express";

import {
  createAdmin,
  deleteAdmin,
  deleteAdmins,
  updateAdmin,
  getAdmin,
  getAdmins,
} from "../../controllers/admin/admin.controller.js";

const authRouter = express.Router();

authRouter.post("/", createAdmin);

// Singles require /:id
authRouter.get("/:id", getAdmin);
authRouter.put("/:id", updateAdmin);
authRouter.delete("/:id", deleteAdmin);

// Multiples
authRouter.get("/", getAdmins);
authRouter.delete("/", deleteAdmins);

export default authRouter;
