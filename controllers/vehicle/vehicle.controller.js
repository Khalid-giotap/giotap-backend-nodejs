import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Vehicle from "../../models/vehicle.model.js";

// Single
export const createVehicle = catchAsyncErrors(async (req, res) => {
  const vehicle = await Vehicle.create(req.body);

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
  if (id) {
    const vehicle = await Vehicle.findById(id);
    res.json({ success: true, data: { vehicle }, message: "Vehicle found!" });
  }
});

export const updateVehicle = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw Error("Id is required to update vehicle!", 400);
  }
  console.log(req.body);
  const vehicle = await Vehicle.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  console.log(vehicle);
  if (!vehicle) throw Error("Vehicle not updated!", 400);
  const vehicles = await Vehicle.find();
  res.json({
    success: true,
    data: { vehicles },
    message: "Vehicle updated successfully!",
  });
});

export const deleteVehicle = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw Error("Id is required to delete vehicle!", 400);
  }

  const vehicle = await Vehicle.findByIdAndDelete(id);
  if (!vehicle) throw Error("Vehicle not deleted!", 400);

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
