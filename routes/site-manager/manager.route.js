import express from "express";
import {
  createSiteManager,
  getSiteManager,
  updateSiteManager,
  deleteSiteManager,
  deleteSiteManagers,
  getSiteManagers,
} from "../../controllers/site-manager/manager.controller.js";

const managerRouter = express.Router();

// Singles required /:id
managerRouter.post("/", createSiteManager);
managerRouter.get("/:id", getSiteManager);
managerRouter.put("/:id", updateSiteManager);
managerRouter.delete("/:id", deleteSiteManager);

// Multiples
managerRouter.delete("/", deleteSiteManagers);
managerRouter.get("/", getSiteManagers);

export default managerRouter;
