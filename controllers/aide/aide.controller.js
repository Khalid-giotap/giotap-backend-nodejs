import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Aide from "../../models/aide.model.js";
import bcrypt from "bcryptjs";

export const createAide = catchAsyncErrors(async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  const aideExist = await Aide.findOne({
    $or: [{ email }, { phone }],
  });
  if (aideExist)
    throw Error("Aide already exist with same phone or email", 400);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const aide = await Aide.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
  });
  if (!aide) throw Error("Some error creating aide, Try again!");

  res.json({
    success: true,
    data: { aide },
    message: "Aide created successfully!",
  });
});

// Singles /:id
export const getAide = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!id) throw Error("Id is required to get admin!", 400);
  const aide = await Aide.findById(id);
  if (!aide) throw Error("Invalid resource, aide does not exist!", 404);

  res.json({
    success: true,
    data: { aide },
    message: "Aide found successfully!",
  });
});

export const updateAide = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to delete aide!", 400);

  const aide = await Aide.findByIdAndUpdate(id, { ...req.body });

  res.json({
    success: true,
    data: { aide },
    message: "Aide updated successfully!",
  });
  console.log("working updateAide");
});

export const deleteAide = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to delete aide!", 400);

  const aide = await Aide.findByIdAndDelete(id);
  if (!aide) throw Error("Invalid resource, aide does not exist!", 404);

  res.json({
    success: true,
    data: { aide },
    message: "Aide deleted successfully!",
  });
});

// Multiples
export const getAides = catchAsyncErrors(async (req, res) => {
  const aides = await Aide.find();
  if (!aides) throw Error("Aides not found!", 404);

  res.json({
    success: true,
    data: { aides },
    message: "Aides found successfully!",
  });
});

export const deleteAides = catchAsyncErrors(async (req, res) => {
  const aides = await Aide.deleteMany();
  if (!aides) throw Error("Aides not found!", 404);

  res.json({
    success: true,
    data: { aides },
    message: "Aide deleted successfully!",
  });
});
