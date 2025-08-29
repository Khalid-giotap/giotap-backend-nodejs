import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import ParkingLot from "../../models/parking-lot.js";
import { createError } from "../../utils/error.js";

export const createParkingLot = catchAsyncErrors(async (req, res, next) => {
  const parkingLot = await ParkingLot.create(req.body);

  res.status(201).json({
    success: true,
    data: {
      lot: parkingLot,
    },
    message: "Parking lot created successfully",
  });
});

export const getParkingLots = catchAsyncErrors(async (req, res, next) => {
  const parkingLots = await ParkingLot.find().populate(
    "vehicleId",
    "_id plateNumber model"
  );

  if (!parkingLots) {
    throw createError("No empty parking lots found", 404);
  }

  res.status(201).json({
    success: true,
    data: {
      lots: parkingLots,
    },
    message: "Parking lots found successfully",
  });
});

export const getParkingLot = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const parkingLot = await ParkingLot.findById(id).populate(
    "vehicleId",
    "_id plateNumber model"
  );

  if (!parkingLot) {
    throw createError("No parking lot found", 404);
  }

  res.json({
    success: true,
    data: {
      lot: parkingLot,
    },
    message: "Parking lot found successfully",
  });
});

export const getEmptyParkingLots = catchAsyncErrors(async (req, res, next) => {
  const parkingLots = await ParkingLot.find({
    $or: [{ vehicleId: null }, { isEmtpy: true }],
  });

  if (!parkingLots) {
    throw createError("No empty parking lots found", 404);
  }

  res.status(201).json({
    success: true,
    data: {
      lots: parkingLots,
    },
    message: "Empty Parking lots found successfully",
  });
});

export const updateParkingLot = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const parkingLot = await ParkingLot.findByIdAndUpdate(id, req.body, {
    new: true,
    populate: {
      path: "vehicleId",
      select: "_id plateNumber model",
    },
  });

  if (!parkingLot) {
    throw createError("error updating parking lot", 404);
  }

  res.json({
    success: true,
    data: {
      lot: parkingLot,
    },
    message: "Parking lot updated successfully",
  });
});

export const deleteParkingLot = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const parkingLot = await ParkingLot.findByIdAndDelete(id);

  if (!parkingLot) {
    throw createError("error deleting parking lot", 404);
  }

  res.json({
    success: true,
    data: {
      lots: parkingLot,
    },
    message: "Parking lot deleted successfully",
  });
});

export const deleteParkingLots = catchAsyncErrors(async (req, res, next) => {
  const parkingLots = await ParkingLot.deleteMany();

  if (!parkingLots) {
    throw createError("some error deleting parking lots", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      lots: parkingLots,
    },
    message: "Parking lots found successfully",
  });
});
