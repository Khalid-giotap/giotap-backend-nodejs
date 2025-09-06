import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Aide from "../../models/aide.model.js";
import Route from "../../models/route.model.js";

export const createAide = catchAsyncErrors(async (req, res) => {
  const { fullName, email, password, phone, transportCompanyId } = req.body;

  const aideExist = await Aide.findOne({
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

  if (aideExist)
    throw Error("Aide already exist with same phone or email", 400);

  const aide = await Aide.create({
    fullName,
    email,
    password,
    phone,
    ...req.body,
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user.transportCompanyId
        : transportCompanyId,
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

export const getAvailableAides = catchAsyncErrors(async (req, res) => {
  const query = {
    vehicleId: null,
  };

  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = req.user.transportCompanyId;
  }

  const aides = await Aide.find(query);
  if (!aides) throw Error("Invalid resource, aides does not exist!", 404);

  res.json({
    success: true,
    data: { aides },
    message: "Available aides found successfully!",
  });
});

export const createAides = catchAsyncErrors(async (req, res) => {
  const aides = req.body;
  if (!Array.isArray(aides) || aides.length === 0) {
    throw Error("Please provide an array of aides");
  }
  // Add transportCompanyId automatically if needed
  const newAides = aides.map((aide) => ({
    ...aide,
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user.transportCompanyId
        : aide.transportCompanyId
        ? aide.transportCompanyId
        : null,
  }));
  const createdAides = await Aide.insertMany(newAides);

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
  if (!id) throw Error("Id is required to update aide!", 400);

  const aide = await Aide.findByIdAndUpdate(id, { ...req.body }, { new: true });

  res.json({
    success: true,
    data: { aide },
    message: "Aide updated successfully!",
  });
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
  const query = {};

  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = req.user.transportCompanyId;
  }
  const aides = await Aide.find(query).populate({
    path: "vehicleId",
    select: "plateNumber model",
  });

  if (!aides) throw Error("Aides not found!", 404);
  res.json({
    success: true,
    data: { aides },
    message: "Aides found successfully!",
  });
});

export const deleteAides = catchAsyncErrors(async (req, res) => {
  const aides = req.body;

  const deletedAides = await Aide.deleteMany({ _id: { $in: aides } });
  if (!deletedAides) throw Error("Aides not found!", 404);

  res.json({
    success: true,
    data: { deletedAides },
    message: "Aides deleted successfully!",
  });
});
