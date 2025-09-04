import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import bcrypt from "bcryptjs";
import Mechanic from "../../models/mechanic.model.js";

export const createMechanic = catchAsyncErrors(async (req, res) => {
  const { fullName, email, password, phone, transportCompanyId } = req.body;

  if (!fullName) throw Error("Name is required!");
  if (!email) throw Error("Email is required!");
  if (!password) throw Error("Password is required!");
  if (!phone) throw Error("Phone is required!");

  let mechanic = await Mechanic.findOne({
    $or: [{ email }, { phone }],
    $and: [
      {
        transportCompanyId:
          req.user.role === "transport-admin"
            ? req.user.transportCompanyId.toString()
            : transportCompanyId,
      },
    ],
  });

  if (mechanic) {
    throw Error("Mechanic with same email or phone exist already!");
  }

  mechanic = await Mechanic.create({
    fullName,
    email,
    phone,
    password,
    ...req.body,
    transportCompanyId:
      req.user.role === "transport-admin" ? req.user.transportCompanyId : null,
  });

  if (!mechanic) throw Error("Some error adding mechanic, Try again!");

  res.status(201).json({
    success: true,
    data: { mechanic },
    message: "Mechanic added successfully!",
  });
});

export const createMechanics = catchAsyncErrors(async (req, res) => {
  const mechanics = req.body;

  if (!Array.isArray(mechanics) || mechanics.length === 0) {
    throw Error("Please provide an array of mechanics");
  }

  // Add createdBy automatically if needed
  const newMechanics = mechanics.map((mechanic) => ({
    ...mechanic,
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user.transportCompanyId
        : mechanic.transportCompanyId
        ? mechanic.transportCompanyId
        : null,
  }));
  const createdMechanics = await Mechanic.insertMany(newMechanics);

  if (!createdMechanics)
    throw Error("Some error occurred creating mechanics, Try again!");

  const totalCount = await Mechanic.countDocuments();

  res.status(201).json({
    success: true,
    data: {
      mechanics: createdMechanics,
      totalCount,
      totalPages: Math.ceil(totalCount / 10),
    },
    message: "Mechanics created successfully",
  });
});

export const getMechanic = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to find the mechanic!");

  const mechanic = await Mechanic.findById(id);

  if (!mechanic) throw Error("Invalid resource, mechanic does not exist!");

  res.status(201).json({
    success: true,
    data: { mechanic },
    message: "Mechanic found successfully!",
  });
});

export const getAvailableMechanics = catchAsyncErrors(async (req, res) => {
  const mechanics = await Mechanic.find({
    assignedVehicle: null,
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user._id
        : req.user.transportCompanyId,
  });

  if (!mechanics) throw Error("Invalid resource, mechanic does not exist!");

  res.status(201).json({
    success: true,
    data: { mechanics },
    message: "Mechanics found successfully!",
  });
});

export const updateMechanic = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to find the mechanic!");

  const mechanic = await Mechanic.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!mechanic) throw Error("Invalid resource, mechanic does not exist!");

  res.status(200).json({
    success: true,
    data: { mechanic },
    message: "Mechanic updated successfully!",
  });
});

export const deleteMechanic = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to find the mechanic!");

  const mechanic = await Mechanic.findByIdAndDelete(id, req.body, {
    new: true,
  });
  if (!mechanic) throw Error("Invalid resource, mechanic does not exist!");

  res.status(200).json({
    success: true,
    data: { mechanic },
    message: "Mechanic deleted successfully!",
  });
});

export const getMechanics = catchAsyncErrors(async (req, res) => {
  const mechanics = await Mechanic.find({
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user._id
        : req.user.transportCompanyId,
  });

  if (!mechanics) throw Error("Mechanics not found!");

  res.status(200).json({
    success: true,
    data: { mechanics },
    message: "Mechanic found successfully!",
  });
});

export const deleteMechanics = catchAsyncErrors(async (req, res) => {
  const mechanics = await Mechanic.deleteMany({
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user._id
        : req.user.transportCompanyId,
  });

  if (!mechanics) throw Error("Mechanics not found!");

  res.status(200).json({
    success: true,
    data: { mechanics },
    message: "Mechanic deleted successfully!",
  });
});
