import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import bcrypt from "bcryptjs";
import Driver from "../../models/driver.model.js";
import Vehicle from "../../models/vehicle.model.js";
import Route from "../../models/route.model.js";

export const createDriver = catchAsyncErrors(async (req, res) => {
  const { email, phone, password } = req.body;

  const existingDriver = await Driver.findOne({ $or: [{ email }, { phone }] });
  if (existingDriver) {
    throw Error("Driver already exist with same phone or email", 400);
  }

  const driver = await Driver.create({
    ...req.body,
  });

  if (!driver) throw Error("Error creating driver, Try again!");

  res.status(201).json({
    success: true,
    data: {
      driver,
    },
    message: "Driver account created successfully!",
  });
});

export const createDrivers = catchAsyncErrors(async (req, res) => {
  const { drivers } = req.body;

  if (!Array.isArray(drivers) || drivers.length === 0) {
    throw Error("Please provide an array of drivers");
  }

  // Add createdBy automatically if needed

  const createdDrivers = await Driver.insertMany(drivers, {
    ordered: false,
  });

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
      console.log(v, r);
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
  const drivers = await Driver.find({
    $or: [{ name: { $regex: search, $options: "i" } }, { isOnDuty: onDuty }],
  })
    .populate("vehicleId")
    .populate("routeId")
    .skip((page - 1) * limit)
    .limit(limit);

  if (!drivers) throw Error("Invalid resource, drivers does not exist!", 404);
  const totalCount = await Driver.countDocuments();
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

export const deleteDrivers = catchAsyncErrors(async (req, res, next) => {
  const drivers = await Driver.deleteMany();

  if (!drivers) throw Error("Invalid resource, drivers does not exist!", 404);

  res.json({
    success: true,
    data: { drivers },
    message: "Drivers found successfully",
  });
});
