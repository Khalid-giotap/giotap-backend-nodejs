import express from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import {
  createCompanies,
  createCompany,
  deleteCompanies,
  deleteCompany,
  getCompanies,
  getCompany,
  updateCompany,
} from "../../controllers/transport-company/company.controller.js";
import { isRoleAuthorized } from "../../middlewares/role.middleware.js";

const companyRouter = express.Router();

// POST /admin/company
companyRouter.post(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  createCompany
);

// POST /admin/bulk
companyRouter.post(
  "/companies",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  createCompanies
);

// GET /admin/company?page=1&limit=10&search=name&status=active
companyRouter.get(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  getCompanies
);

// GET /admin/companies/:id
// Response: { company: {...}, schools: [...], vehicles: [...] }
// Populate: Associated schools and vehicles
companyRouter.get(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  getCompany
);

// PUT /admin/companies/:id
// Body: { name?, address?, phone?, email?, status? }
// Validation: Check if name/license already exists for other companies
companyRouter.put(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  updateCompany
);

// DELETE /admin/companies/:id

companyRouter.delete(
  "/:id",
  isAuthenticated,
  isRoleAuthorized(["super-admin", "transport-admin"]),
  deleteCompany
);

companyRouter.delete(
  "/",
  isAuthenticated,
  isRoleAuthorized(["super-admin"]),
  deleteCompanies
);

// Check: No active routes associated before deletion
// Response: { success: true, message: "Company deleted" }

export default companyRouter;
