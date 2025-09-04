import express from "express";
import { getDashboardStatistics, getSchoolStatistics, getTransportCompanyStatistics } from "../controllers/stats/stats.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { isRoleAuthorized } from "../middlewares/role.middleware.js";

const statRouter = express.Router()


statRouter.get("/transport-company", isAuthenticated, isRoleAuthorized(['transport-admin']), getTransportCompanyStatistics);
statRouter.get("/school", isAuthenticated, isRoleAuthorized(['school-admin']), getSchoolStatistics);
statRouter.get("/dashboard", isAuthenticated, isRoleAuthorized(['super-admin']), getDashboardStatistics);

export default statRouter;
