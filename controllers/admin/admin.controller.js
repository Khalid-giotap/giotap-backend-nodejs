import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import bcrypt from "bcryptjs";
import Admin from "../../models/admin.model.js";
import TransportCompany from "../../models/transport-company.model.js";
import School from "../../models/school.model.js";

export const createAdmin = catchAsyncErrors(async (req, res) => {
  const { email, phone } = req.body;
  console.log("createAdmin");
  let admin = await Admin.findOne({ $or: [{ email }, { phone }] });

  if (admin) throw Error("Admin already exist with same phone or email", 400);

  admin = await Admin.create({ ...req.body });
  if (!admin) throw Error("Error creating admin, Try again!", 400);
  console.log(admin);
  res.status(201).json({
    success: true,
    data: {
      user: admin,
    },
    message: "Admin account created successfully!",
  });
});

export const createAdmins = catchAsyncErrors(async (req, res) => {
  // console.log('body he re',req.body)
  const admins = req.body;

  if (!Array.isArray(admins) || admins.length === 0)
    throw Error("Please provide an array of admins");

  // Add createdBy automatically if needed
  const createdAdmins = await Admin.insertMany(admins, {
    ordered: false,
  });

  console.log(createdAdmins);
  if (!createdAdmins)
    throw Error("Some error occurred creating admins, Try again!");

  const totalCount = await Admin.countDocuments();

  res.status(201).json({
    success: true,
    data: {
      users: createdAdmins,
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
  const admin = await Admin.findById(id);
  if (!admin) throw Error("Invalid resource, admin does not exist!", 404);

  res.json({
    success: true,
    data: { user: admin },
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
    data: { user: admin },
    message: "Admin deleted successfully!",
  });
});

export const updateAdmin = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { role, schoolId, transportCompanyId } = req.body;

  if (!id) throw Error("Id is required to update admin!", 400);

  if (
    role !== "school-admin" &&
    role !== "super-admin" &&
    role !== "transport-admin"
  )
    throw Error(
      'Role must be "school-admin" or "super-admin" or "transport-admin"',
      400
    );
  const admin = await Admin.findByIdAndUpdate(id, req.body, { new: true });
  console.log(req.body);
  if (transportCompanyId) {

    if (admin.schoolId !== null) {
      await TransportCompany.findByIdAndUpdate(admin.transportCompanyId, {
        admin: null,
      });
    }
    await TransportCompany.findByIdAndUpdate(transportCompanyId, {
      admin: admin._id,
    });
    admin.transportCompanyId = transportCompanyId._id;
  }

  if (schoolId) {
    console.log("here2", admin);
    if (admin.schoolId !== null) {
      await School.findByIdAndUpdate(admin.schoolId, {
        admin: null,
      });
    }
    await School.findByIdAndUpdate(schoolId, {
      admin: admin._id,
    });
    //   throw Error()
    admin.schoolId = schoolId._id;
  }
  await admin.save();

  if (!admin) throw Error("Invalid resource, admin not exist!", 404);
  res.json({
    success: true,
    message: "Admin updated successfully!",
    data: { user: admin },
  });
});

export const deleteAdmins = catchAsyncErrors(async (req, res) => {
  const admins = await Admin.deleteMany();
  if (!admins) throw Error("Admins not found!", 404);

  res.json({
    success: true,
    data: { users: admins },
    message: "Admins deleted successfully!",
  });
});

export const getAdmins = catchAsyncErrors(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const query = { _id: { $ne: req.user._id } }; // Exclude authenticated user
  if (search !== "") {
    query.$or = [{ name: { $regex: search, $options: "i" } }];
  }
  const users = await Admin.find(query)
    .populate("schoolId")
    .populate("transportCompanyId")
    .skip((page - 1) * limit)
    .limit(limit);

  if (!users) throw Error("Admins not found!", 404);

  const totalCount = await Admin.countDocuments(query);
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
