import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import bcrypt from "bcryptjs";
import Mechanic from "../../models/mechanic.model.js";

export const createMechanic = catchAsyncErrors(async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  if (!fullName) throw Error("Name is required!");
  if (!email) throw Error("Email is required!");
  if (!password) throw Error("Password is required!");
  if (!phone) throw Error("Phone is required!");

  let mechanic = await Mechanic.findOne({ $or: [{ email }, { phone }] });

  if (mechanic) {
    throw Error("Mechanic with same email or phone exist already!");
  }

  console.log(mechanic);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  mechanic = await Mechanic.create({
    fullName,
    email,
    phone,
    password: hashedPassword,
  });
  console.log(mechanic);
  if (!mechanic) throw Error("Some error adding mechanic, Try again!");

  res.status(201).json({
    success: true,
    data: { mechanic },
    message: "Mechanic added successfully!",
  });
});

export const getMechanic = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to find the mechanic!");

  const mechanic = await Mechanic.findById(id);

  if (!mechanic) throw Error("Invalid resource, mechanic does not exist!");
  console.log(mechanic);

  res.status(201).json({
    success: true,
    data: { mechanic },
    message: "Mechanic found successfully!",
  });
});

export const updateMechanic = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to find the mechanic!");

  const mechanic = await Mechanic.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!mechanic) throw Error("Invalid resource, mechanic does not exist!");

  console.log(mechanic);
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

  const mechanics = await Mechanic.find();
  
  if (!mechanics) throw Error("Mechanics not found!");

  res.status(200).json({
    success: true,
    data: { mechanics },
    message: "Mechanic found successfully!",
  });
});

export const deleteMechanics = catchAsyncErrors(async (req, res) => {

  const mechanics = await Mechanic.deleteMany();
  
  if (!mechanics) throw Error("Mechanics not found!");

  res.status(200).json({
    success: true,
    data: { mechanics },
    message: "Mechanic deleted successfully!",
  });
});
