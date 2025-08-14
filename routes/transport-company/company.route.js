import express from "express";
import { isAdminAuthenticated } from "../../middlewares/auth.middleware.js";
import {
  createCompanies,
  createCompany,
  getCompanies,
  getCompany,
  updateCompany
} from "../../controllers/transport-company/company.controller.js";

const companyRouter = express.Router();

// POST /admin/company
companyRouter.post("/", isAdminAuthenticated, createCompany);

// POST /admin/bulk
companyRouter.post("/bulk", isAdminAuthenticated, createCompanies);

// GET /admin/company?page=1&limit=10&search=name&status=active
companyRouter.get("/", getCompanies);

// GET /admin/companies/:id
// Response: { company: {...}, schools: [...], vehicles: [...] }
// Populate: Associated schools and vehicles
companyRouter.get("/:id", getCompany);

// PUT /admin/companies/:id
// Body: { name?, address?, phone?, email?, status? }
// Validation: Check if name/license already exists for other companies
companyRouter.put("/:id", isAdminAuthenticated, updateCompany);

// DELETE /admin/companies/:id
// Check: No active routes associated before deletion
// Response: { success: true, message: "Company deleted" }

export default companyRouter;
