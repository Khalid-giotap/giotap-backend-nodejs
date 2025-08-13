import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import bcrypt from "bcryptjs";
import Admin from "../../models/admin.model.js";

export const createAdmin = catchAsyncErrors(async (req, res) => {
  const { email, phone, password } = req.body;

  const existingAdmin = await Admin.findOne({ $or: [{ email }, { phone }] });
  console.log(existingAdmin)
  if (existingAdmin)
    throw Error("Admin already exist with same phone or email", 400);
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const newAdmin = await Admin.create({
    ...req.body,
    password: hashedPassword,
  });
  
  console.log(newAdmin)
  if (!newAdmin) throw Error("Error creating admin, Try again!", 400);
  res.status(201).json({
    success: true,
    data: {
      admin: newAdmin,
    },
    message: "Admin account created successfully!",
  });
});

export const getAdmin = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  console.log("we are at getAdmin", id);
  if (!id) throw Error("Id is required to get admin!", 400);
  const admin = await Admin.findById(id);
  if (!admin) throw Error("Invalid resource, admin does not exist!", 404);

  res.json({
    success: true,
    data: { admin },
    message: "Admin found successfully!",
  });
});

export const deleteAdmin = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to delete admin!", 400);

  const admin = await Admin.findByIdAndDelete(id);
  if (!admin) throw Error("Invalid resource, admin does not exist!", 404);

  res.json({
    success: true,
    data: { admin },
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

  const admin = await Admin.findByIdAndUpdate(id, req.body, { new: true });
  if (!admin) throw Error("Invalid resource, admin not exist!", 404);
  res.json({
    success: true,
    message: "Admin updated successfully!",
    data: { admin },
  });
});

export const deleteAdmins = catchAsyncErrors(async (req, res) => {
  const admins = await Admin.deleteMany();
  if (!admins) throw Error("Admins not found!", 404);

  res.json({
    success: true,
    data: { admins },
    message: "Admins deleted successfully!",
  });
});

export const getAdmins = catchAsyncErrors(async (req, res) => {

  const admins = await Admin.find();

  if (!admins) throw Error("Admins not found!", 404);
  res.json({
    success: true,
    data: { admins },
    message: "Admins found successfully!",
  });
});
