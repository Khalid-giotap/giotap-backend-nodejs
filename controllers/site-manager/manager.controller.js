import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import SiteManager from "../../models/site-manager.model.js";
import bcrypt from "bcryptjs";

export const createSiteManager = catchAsyncErrors(async (req, res) => {
  const { fullName, email, phone, password, transportCompanyId } = req.body;

  if (!fullName || !email || !phone || !password) {
    throw Error("All fields are required", 400);
  }

  const user = await SiteManager.create({
    fullName,
    email,
    phone,
    password,
    ...req.body,
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user.transportCompanyId
        : transportCompanyId,
  });

  if (!user) throw Error("Some error adding Site Manager, Try again!", 400);

  res.json({
    success: true,
    data: { manager: user },
    message: "Site Manager account created successfully!",
  });
});

export const createSiteManagers = catchAsyncErrors(async (req, res) => {
  const managers = req.body;

  if (!Array.isArray(managers) || managers.length === 0) {
    throw Error("Please provide an array of managers");
  }

  // Add createdBy automatically if needed
  const newManagers = managers.map((manager) => {
    return {
      ...manager,
      transportCompanyId:
        req.user.role === "transport-admin"
          ? req.user._id
          : req.user.transportCompanyId,
    };
  });

  const createdManagers = await SiteManager.insertMany(newManagers);

  if (!createdManagers)
    throw Error("Some error occurred creating managers, Try again!");

  const totalCount = await SiteManager.countDocuments();

  res.status(201).json({
    success: true,
    data: {
      managers: createdManagers,
      totalCount,
      totalPages: Math.ceil(totalCount / 10),
    },
    message: "Managers created successfully",
  });
});

export const getSiteManager = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw Error("Id is required to get Site Manager", 400);
  }

  const siteManager = await SiteManager.findById(id, {
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user._id
        : req.user.transportCompanyId,
  });

  if (!siteManager)
    throw Error("Invalid resource, Site Manager does not exist!", 400);

  res.json({
    success: true,
    data: { manager: siteManager },
    message: "Site Manager found successfully!",
  });
});

export const updateSiteManager = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw Error("Id is required to get Site Manager", 400);
  }

  const siteManager = await SiteManager.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true },
    {
      transportCompanyId:
        req.user.role === "transport-admin"
          ? req.user._id
          : req.user.transportCompanyId,
    }
  );

  if (!siteManager)
    throw Error("Invalid resource, Site Manager does not exist!", 400);

  res.json({
    success: true,
    data: { manager: siteManager },
    message: "Site Manager updated successfully!",
  });
});

export const deleteSiteManager = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw Error("Id is required to get Site Manager", 400);
  }

  const siteManager = await SiteManager.findByIdAndDelete(id, {
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user._id
        : req.user.transportCompanyId,
  });

  if (!siteManager)
    throw Error("Invalid resource, Site Manager does not exist!", 400);

  res.json({
    success: true,
    data: { manager: siteManager },
    message: "Site Manager deleted successfully!",
  });
});

export const getSiteManagers = catchAsyncErrors(async (req, res) => {
  const siteManagers = await SiteManager.find({
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user._id
        : req.user.transportCompanyId,
  });

  if (!siteManagers)
    throw Error("Invalid resource, Site Managers not found!", 400);

  res.json({
    success: true,
    data: { managers: siteManagers },
    message: "Site Managers deleted successfully!",
  });
});

export const deleteSiteManagers = catchAsyncErrors(async (req, res) => {
  const siteManagers = await SiteManager.deleteMany({
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user._id
        : req.user.transportCompanyId,
  });

  if (!siteManagers)
    throw Error("Invalid resource, Site Managers not found!", 400);

  res.json({
    success: true,
    data: { managers: siteManagers },
    message: "Site Managers deleted successfully!",
  });
});
