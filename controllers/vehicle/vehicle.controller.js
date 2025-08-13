import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Vehicle from "../../models/vehicle.model.js";

// Single
export const createVehicle = catchAsyncErrors(async (req, res) => {
  const { plateNumber } = req.body;
  let vehicle = await Vehicle.findOne({ plateNumber });
  if (vehicle) throw Error("Vehicle with same plate number exist already!");

  vehicle = await Vehicle.create(req.body);

  if (!vehicle) throw Error("Error creating vehicle!", 400);

  res.status(201).json({
    success: true,
    data: {
      vehicle,
    },
    message: "Vehicle added successfully!",
  });
});
export const getVehicle = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to find the vehicle!");
  const vehicle = await Vehicle.findById(id);

  if (vehicle) throw Error("Invalid resource, Vehicle not found!");

  res.json({
    success: true,
    data: { vehicle },
    message: "Vehicle found successfully!",
  });
});

export const updateVehicle = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to update vehicle!", 400);

  const vehicle = await Vehicle.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!vehicle) throw Error("Invalid resource, Vehicle does not exist!", 400);

  const vehicles = await Vehicle.find();
  res.json({
    success: true,
    data: { vehicles },
    message: "Vehicle updated successfully!",
  });
});

export const deleteVehicle = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to delete vehicle!", 400);

  const vehicle = await Vehicle.findByIdAndDelete(id);

  if (!vehicle) throw Error("Invalid, resource, Vehicle does not exist!", 400);

  res.json({
    success: true,
    data: { vehicle },
    message: "Vehicle deleted successfully!",
  });
});

// Multiples
export const deleteVehicles = catchAsyncErrors(async (req, res) => {
  const vehicles = await Vehicle.deleteMany();
  if (!vehicles) throw Error("Vehicles not found", 404);

  res.json({
    success: true,
    data: { vehicles },
    message: "Vehicles deleted successfully!",
  });
});
export const getVehicles = catchAsyncErrors(async (req, res) => {
  const vehicles = await Vehicle.find();

  if (!vehicles) {
    throw Error("Vehicles not found!", 404);
  }
  
  res.json({
    success: true,
    data: { vehicles },
    message: "Vehicles found successfully",
  });
});
