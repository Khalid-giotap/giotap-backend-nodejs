import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Aide from "../../models/aide.model.js";
import Route from "../../models/route.model.js";

export const createAide = catchAsyncErrors(async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  const aideExist = await Aide.findOne({
    $or: [{ email }, { phone }],
  });
  if (aideExist)
    throw Error("Aide already exist with same phone or email", 400);

  const aide = await Aide.create({
    fullName,
    email,
    password,
    phone,
  });
  if (!aide) throw Error("Some error creating aide, Try again!");

  res.json({
    success: true,
    data: { aide },
    message: "Aide account created successfully!",
  });
});

export const getAide = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to get aide!", 400);

  const aide = await Aide.findById(id);
  if (!aide) throw Error("Invalid resource, aide does not exist!", 404);

  res.json({
    success: true,
    data: { aide },
    message: "Aide found successfully!",
  });
});

export const createAides = catchAsyncErrors(async (req, res) => {
  const { aides } = req.body;

  if (!Array.isArray(aides) || aides.length === 0) {
    throw Error("Please provide an array of aides");
  }

  // Add createdBy automatically if needed

  const createdAides = await Aide.insertMany(aides, {
    ordered: false,
  });

  if (!createdAides)
    throw Error("Some error occurred creating aides, Try again!");

  const totalCount = await Aide.countDocuments();

  res.status(201).json({
    success: true,
    data: {
      aides: createdAides,
      totalCount,
      totalPages: Math.ceil(totalCount / 10),
    },
    message: "Aides created successfully",
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
  await Route.findOneAndUpdate({ aideId: id }, { aideId: null });
  res.json({
    success: true,
    data: { aide },
    message: "Aide deleted successfully!",
  });
});

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
