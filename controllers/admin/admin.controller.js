import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import bcrypt from "bcryptjs";
import Admin from "../../models/admin.model.js";

export const createAdmin = catchAsyncErrors(async (req, res) => {
  const { email, phone, password } = req.body;

  let user = await Admin.findOne({ $or: [{ email }, { phone }] });

  if (user) throw Error("Admin already exist with same phone or email", 400);

  user = await Admin.create({ ...req.body });
  if (!user) throw Error("Error creating admin, Try again!", 400);

  res.status(201).json({
    success: true,
    data: {
      user,
    },
    message: "Admin account created successfully!",
  });
});

export const createAdmins = catchAsyncErrors(async (req, res) => {
  const { admins } = req.body;

  if (!Array.isArray(admins) || admins.length === 0) {
    return res.status(400).json({ error: "Please provide an array of admins" });
  }

  // Add createdBy automatically if needed

  const createdAdmins = await Admin.insertMany(admins, {
    ordered: false,
  });

  if (!createdAdmins)
    throw Error("Some error occurred creating admins, Try again!");

  const totalCount = await Admin.countDocuments();

  res.status(201).json({
    success: true,
    data: {
      admins: createdAdmins,
      totalCount,
      totalPages: Math.ceil(totalCount / 10),
    },
    message: "Admins created successfully",
  });
});

export const getAdmin = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  console.log("we are at getAdmin", id);
  if (!id) throw Error("Id is required to get admin!", 400);
  const user = await Admin.findById(id);
  if (!user) throw Error("Invalid resource, admin does not exist!", 404);

  res.json({
    success: true,
    data: { user },
    message: "Admin found successfully!",
  });
});

export const deleteAdmin = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to delete admin!", 400);

  const user = await Admin.findByIdAndDelete(id);
  if (!user) throw Error("Invalid resource, admin does not exist!", 404);

  res.json({
    success: true,
    data: { user },
    message: "Admin deleted successfully!",
  });
});

export const updateAdmin = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!id) throw Error("Id is required to update admin!", 400);

  if (
    role !== "school_admin" &&
    role !== "super_admin" &&
    role !== "transport_admin"
  )
    throw Error(
      'Role must be "school_admin" or "super_admin" or "transport_admin"',
      400
    );

  const user = await Admin.findByIdAndUpdate(id, req.body, { new: true });
  if (!user) throw Error("Invalid resource, admin not exist!", 404);
  res.json({
    success: true,
    message: "Admin updated successfully!",
    data: { user },
  });
});

export const deleteAdmins = catchAsyncErrors(async (req, res) => {
  const users = await Admin.deleteMany();
  if (!users) throw Error("Admins not found!", 404);

  res.json({
    success: true,
    data: { users },
    message: "Admins deleted successfully!",
  });
});

export const getAdmins = catchAsyncErrors(async (req, res) => {
  const { page = 1, limit = 10, search = "", role = "super_admin" } = req.query;
  const users = await Admin.find({
    $or: [{ name: { $regex: search, $options: "i" } }, { role }],
  })
    .populate("schoolId")
    .populate("transportCompanyId")
    .skip((page - 1) * limit)
    .limit(limit);

  if (!users) throw Error("Admins not found!", 404);

  const totalCount = await Admin.countDocuments();
  res.json({
    success: true,
    data: {
      users,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    },
    message: "Admins found successfully!",
  });
});
