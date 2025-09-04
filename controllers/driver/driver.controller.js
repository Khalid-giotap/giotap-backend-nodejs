import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Driver from "../../models/driver.model.js";
import Vehicle from "../../models/vehicle.model.js";
import Route from "../../models/route.model.js";

export const createDriver = catchAsyncErrors(async (req, res) => {
  const { email, phone, password, transportCompanyId } = req.body;

  const existingDriver = await Driver.findOne({ $or: [{ email }, { phone }] });
  if (existingDriver) {
    throw Error("Driver already exist with same phone or email", 400);
  }
  const driver = await Driver.create({
    ...req.body,
    vehicleId: req.body.vehicleId === '' ? null: req.body.vehicleId ,
    routeId: req.body.routeId === '' ? null: req.body.routeId ,
    transportCompanyId: req.user.role === "transport-admin" ? req.user.transportCompanyId.toString() : transportCompanyId,
  });

  if (!driver) throw Error("Error creating driver, Try again!");

  // Broadcast real-time update
  if (global.io) {
    global.io.to("drivers-updates").emit("driver-update", {
      type: "created",
      driver,
      timestamp: new Date().toISOString(),
    });

    // Broadcast dashboard update (optimized with single aggregation)
    const driverStats = await Driver.aggregate([
      {
        $group: {
          _id: null,
          totalDrivers: { $sum: 1 },
          activeDrivers: {
            $sum: { $cond: [{ $eq: ["$isOnDuty", true] }, 1, 0] }
          }
        }
      }
    ]);
    const stats = driverStats[0] || { totalDrivers: 0, activeDrivers: 0 };
    global.io.to("admin-dashboard").emit("dashboard-update", {
      type: "drivers",
      data: stats,
      timestamp: new Date().toISOString(),
    });
  }

  res.status(201).json({
    success: true,
    data: {
      driver,
    },
    message: "Driver account created successfully!",
  });
});

export const createDrivers = catchAsyncErrors(async (req, res) => {
  const drivers = req.body;
  if (!Array.isArray(drivers) || drivers.length === 0) {
    throw Error("Please provide an array of drivers");
  }

  // Add transportCompanyId automatically if needed
  const newDrivers = drivers.map((driver) => ({
    ...driver,
    transportCompanyId: req.user.role === "transport-admin" ? req.user.transportCompanyId : driver.transportCompanyId,
  }));
  const createdDrivers = await Driver.insertMany(newDrivers);

  if (!createdDrivers)
    throw Error("Some error occurred creating drivers, Try again!");

  const totalCount = await Driver.countDocuments();

  res.status(201).json({
    success: true,
    data: {
      drivers: createdDrivers,
      totalCount,
      totalPages: Math.ceil(totalCount / 10),
    },
    message: "Drivers created successfully",
  });
});

export const getDriver = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to get driver!", 400);

  const driver = await Driver.findById(id);

  if (!driver) throw Error("Invalid resource, driver does not exist!", 404);

  res.json({
    success: true,
    data: { driver },
    message: "Driver found successfully",
  });
});

export const updateDriver = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { vehicleId, routeId } = req.body;

  if (vehicleId) {
    if (routeId) {
      const v = await Vehicle.findByIdAndUpdate(
        vehicleId,
        { routeId },
        { new: true }
      );
      const r = await Route.findByIdAndUpdate(routeId, {
        vehicleId,
        driverId: id,
      });
    }
  }
  if (!vehicleId && !routeId) {
    const driver = await Driver.findById(id);
    await Vehicle.findByIdAndUpdate(driver.vehicleId, { routeId: null });
    await Route.findByIdAndUpdate(driver.routeId, {
      vehicleId: null,
      driverId: null,
    });
  }
  const updatedDriver = await Driver.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedDriver)
    throw Error("Invalid resource, driver does not exist!", 404);

  // Broadcast real-time update
  if (global.io) {
    global.io.to("drivers-updates").emit("driver-update", {
      type: "updated",
      driver: updatedDriver,
      timestamp: new Date().toISOString(),
    });

    // Broadcast dashboard update (optimized with single aggregation)
    const driverStats = await Driver.aggregate([
      {
        $group: {
          _id: null,
          totalDrivers: { $sum: 1 },
          activeDrivers: {
            $sum: { $cond: [{ $eq: ["$isOnDuty", true] }, 1, 0] }
          }
        }
      }
    ]);
    const stats = driverStats[0] || { totalDrivers: 0, activeDrivers: 0 };
    global.io.to("admin-dashboard").emit("dashboard-update", {
      type: "drivers",
      data: stats,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    data: { driver: updatedDriver },
    message: "Driver updated successfully!",
  });
});

export const deleteDriver = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to delete driver!", 400);

  const driver = await Driver.findByIdAndDelete(id);
  if (!driver) throw Error("Invalid resource, driver does not exist!", 404);

  await Route.findOneAndUpdate({ driverId: id }, { driverId: null });

  // Broadcast real-time update
  if (global.io) {
    global.io.to("drivers-updates").emit("driver-update", {
      type: "deleted",
      driverId: id,
      timestamp: new Date().toISOString(),
    });

    // Broadcast dashboard update (optimized with single aggregation)
    const driverStats = await Driver.aggregate([
      {
        $group: {
          _id: null,
          totalDrivers: { $sum: 1 },
          activeDrivers: {
            $sum: { $cond: [{ $eq: ["$isOnDuty", true] }, 1, 0] }
          }
        }
      }
    ]);
    const stats = driverStats[0] || { totalDrivers: 0, activeDrivers: 0 };
    global.io.to("admin-dashboard").emit("dashboard-update", {
      type: "drivers",
      data: stats,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    data: {
      driver,
    },
    message: "Driver deleted successfully!",
  });
});

export const getDrivers = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, limit = 10, onDuty, search = "" } = req.query;

  const query = {};
  
  console.log(req.user)
  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = req.user.transportCompanyId.toString()
  }

  if (search) {
    query.fullName = { $regex: search, $options: "i" };
  }

  if (onDuty !== undefined) {
    query.isOnDuty = onDuty === 'true';
  }

  console.log(query)
  const drivers = await Driver.find()
  console.log(drivers)
    // .populate("vehicleId", "plateNumber model capacity")
    // .populate("routeId", "name stops startLocation endLocation")
    // .skip((page - 1) * limit)
    // .limit(limit);

    console.log(drivers)
  if (!drivers) throw Error("Invalid resource, drivers does not exist!", 404);
  const totalCount = await Driver.countDocuments(query);
  res.json({
    success: true,
    data: {
      drivers,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    },
    message: "Drivers found successfully",
  });
});

export const getAvailableDrivers = catchAsyncErrors(async (req, res, next) => {
  const query = {
    routeId: null,
    vehicleId: null,
  };
  
  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = new mongoose.Types.ObjectId(req.user.transportCompanyId);
  }

  const drivers = await Driver.find(query);

  if (!drivers) throw Error("Invalid resource, drivers does not exist!", 404);

  const totalCount = drivers.length;

  res.json({
    success: true,
    data: {
      drivers,
      totalCount,
    },
    message: "Available drivers found successfully",
  });
});

export const deleteDrivers = catchAsyncErrors(async (req, res, next) => {
  const query = {};
  
  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = new mongoose.Types.ObjectId(req.user.transportCompanyId);
  }

  const drivers = await Driver.deleteMany(query);

  if (!drivers) throw Error("Invalid resource, drivers does not exist!", 404);

  res.json({
    success: true,
    data: { drivers },
    message: "Drivers found successfully",
  });
});
