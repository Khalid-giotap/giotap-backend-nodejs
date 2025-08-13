import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import SiteManager from "../../models/site-manger.model.js";
import bcrypt from "bcryptjs";

export const createSiteManager = catchAsyncErrors(async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    throw Error("All fields are required", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const siteManager = await SiteManager.create({
    fullName,
    email,
    phone,
    password: hashedPassword,
  });

  if (!siteManager)
    throw Error("Some error adding Site Manager, Try again!", 400);

  res.json({
    success: true,
    data: { siteManager },
    message: "Site Manager account created successfully!",
  });
});

export const getSiteManager = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw Error("Id is required to get Site Manager", 400);
  }

  const siteManager = await SiteManager.findById(id);

  if (!siteManager)
    throw Error("Invalid resource, Site Manager does not exist!", 400);

  res.json({
    success: true,
    data: { siteManager },
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
    { new: true }
  );

  if (!siteManager)
    throw Error("Invalid resource, Site Manager does not exist!", 400);

  res.json({
    success: true,
    data: { siteManager },
    message: "Site Manager updated successfully!",
  });
});

export const deleteSiteManager = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw Error("Id is required to get Site Manager", 400);
  }

  const siteManager = await SiteManager.findByIdAndDelete(id);

  if (!siteManager)
    throw Error("Invalid resource, Site Manager does not exist!", 400);

  res.json({
    success: true,
    data: { siteManager },
    message: "Site Manager deleted successfully!",
  });
});

export const getSiteManagers = catchAsyncErrors(async (req, res) => {
  const siteManagers = await SiteManager.find();

  if (!siteManagers)
    throw Error("Invalid resource, Site Managers not found!", 400);

  res.json({
    success: true,
    data: { siteManagers },
    message: "Site Managers deleted successfully!",
  });
});

export const deleteSiteManagers = catchAsyncErrors(async (req, res) => {
  const siteManagers = await SiteManager.deleteMany();

  if (!siteManagers)
    throw Error("Invalid resource, Site Managers not found!", 400);

  res.json({
    success: true,
    data: { siteManagers },
    message: "Site Managers deleted successfully!",
  });
});
