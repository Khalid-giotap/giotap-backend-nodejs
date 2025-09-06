import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Mechanic from "../../models/mechanic.model.js";
import Route from "../../models/route.model.js";
import Vehicle from "../../models/vehicle.model.js";

// Single
export const createVehicle = catchAsyncErrors(async (req, res) => {
  const { plateNumber } = req.body;
  const query = { plateNumber };

  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = req.user.transportCompanyId.toString();
  }

  let vehicle = await Vehicle.findOne(query);

  if (vehicle) throw Error("Vehicle with same plate number exist already!");

  vehicle = await Vehicle.create({
    ...req.body,
    routeId: null,
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user.transportCompanyId.toString()
        : req.body.transportCompanyId,
  });

  if (!vehicle) throw Error("Error creating vehicle!", 400);

  // Broadcast real-time update
  if (global.io) {
    global.io.to("vehicles-updates").emit("vehicle-update", {
      type: "created",
      vehicle,
      timestamp: new Date().toISOString(),
    });

    // Broadcast dashboard update (optimized with single aggregation)
    const vehicleStats = await Vehicle.aggregate([
      {
        $group: {
          _id: null,
          totalVehicles: { $sum: 1 },
          activeVehicles: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          maintenanceVehicles: {
            $sum: { $cond: [{ $eq: ["$status", "maintenance"] }, 1, 0] },
          },
        },
      },
    ]);
    const stats = vehicleStats[0] || {
      totalVehicles: 0,
      activeVehicles: 0,
      maintenanceVehicles: 0,
    };
    global.io.to("admin-dashboard").emit("dashboard-update", {
      type: "vehicles",
      data: stats,
      timestamp: new Date().toISOString(),
    });
  }

  res.status(201).json({
    success: true,
    data: {
      vehicle,
    },
    message: "Vehicle added successfully!",
  });
});

export const createVehicles = catchAsyncErrors(async (req, res) => {
  const vehicles = req.body;

  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    throw Error("Please provide an array of vehicles");
  }

  // Add transportCompanyId automatically if needed
  const newVehicles = vehicles.map((vehicle) => {
    return {
      ...vehicle,
      transportCompanyId:
        req.user.role === "transport-admin"
          ? req.user._id
          : vehicle.transportCompanyId,
    };
  });
  const createdVehicles = await Vehicle.insertMany(newVehicles);

  if (!createdVehicles)
    throw Error("Some error occurred creating vehicles, Try again!");

  const totalCount = await Vehicle.countDocuments();

  res.status(201).json({
    success: true,
    data: {
      vehicles: createdVehicles,
      totalCount,
      totalPages: Math.ceil(totalCount / 10),
    },
    message: "Vehicles created successfully",
  });
});

export const getVehicle = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to find the vehicle!");
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) throw Error("Invalid resource, Vehicle not found!");

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

  // Broadcast real-time update
  if (global.io) {
    global.io.to("vehicles-updates").emit("vehicle-update", {
      type: "updated",
      vehicle,
      timestamp: new Date().toISOString(),
    });

    // Broadcast dashboard update (optimized with single aggregation)
    const vehicleStats = await Vehicle.aggregate([
      {
        $group: {
          _id: null,
          totalVehicles: { $sum: 1 },
          activeVehicles: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          maintenanceVehicles: {
            $sum: { $cond: [{ $eq: ["$status", "maintenance"] }, 1, 0] },
          },
        },
      },
    ]);
    const stats = vehicleStats[0] || {
      totalVehicles: 0,
      activeVehicles: 0,
      maintenanceVehicles: 0,
    };
    global.io.to("admin-dashboard").emit("dashboard-update", {
      type: "vehicles",
      data: stats,
      timestamp: new Date().toISOString(),
    });
  }

  const query = {};

  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = req.user._id;
  }

  const vehicles = await Vehicle.find(query);
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
  await Mechanic.findOneAndUpdate(
    { assignedVehicle: id },
    { assignedVehicle: null }
  );
  await Route.findOneAndUpdate({ vehicleId: id }, { vehicleId: null });

  // Broadcast real-time update
  if (global.io) {
    global.io.to("vehicles-updates").emit("vehicle-update", {
      type: "deleted",
      vehicleId: id,
      timestamp: new Date().toISOString(),
    });

    // Broadcast dashboard update (optimized with single aggregation)
    const vehicleStats = await Vehicle.aggregate([
      {
        $group: {
          _id: null,
          totalVehicles: { $sum: 1 },
          activeVehicles: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          maintenanceVehicles: {
            $sum: { $cond: [{ $eq: ["$status", "maintenance"] }, 1, 0] },
          },
        },
      },
    ]);
    const stats = vehicleStats[0] || {
      totalVehicles: 0,
      activeVehicles: 0,
      maintenanceVehicles: 0,
    };
    global.io.to("admin-dashboard").emit("dashboard-update", {
      type: "vehicles",
      data: stats,
      timestamp: new Date().toISOString(),
    });
  }

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
  const { page = 1, limit = 10, search = "", filters = {} } = req.query;
  const query = {};

  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = req.user.transportCompanyId.toString();
  }

  if (search) {
    query.$or = [
      { plateNumber: { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
    ];
  }
  if (Object.keys(filters).length > 0) {
    query.$and = Object.entries(filters).map(([key, value]) => ({
      [key]: value,
    }));
  }

  const vehicles = await Vehicle.find(query)
    .populate({
      path: "routeId",
      select: "name startLocation endLocation driverId stops",
      populate: {
        path: "driverId",
        select: "fullName email phone licenseId isOnDuty status experience",
      },
    })
    .skip((page - 1) * limit)
    .limit(limit);
  if (!vehicles) {
    throw Error("Vehicles not found!", 404);
  }

  const totalCount = await Vehicle.countDocuments();

  res.json({
    success: true,
    data: {
      vehicles,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    },
    message: "Vehicles found successfully",
  });
});

export const getAvailableVehicles = catchAsyncErrors(async (req, res) => {
  const query = {
    routeId: null,
  };

  const vehicles = await Vehicle.find(query);
  if (!vehicles) {
    throw Error("Vehicles not found!", 404);
  }

  const totalCount = await Vehicle.countDocuments();

  res.json({
    success: true,
    data: {
      vehicles,
      totalCount,
    },
    message: "Vehicles found successfully",
  });
});
