import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import bcrypt from "bcryptjs";
import Driver from "../../models/driver.model.js";

export const createDriver = catchAsyncErrors(async (req, res) => {
  console.log("we are here");
  const { email, phone, password } = req.body;
  const existingDriver = await Driver.findOne({ $or: [{ email }, { phone }] });
  if (existingDriver) {
    console.log(existingDriver + "here");

    throw Error("Driver already exist with same phone or email", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const driver = await Driver.create({
    ...req.body,
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    data: {
      driver,
    },
    message: "Driver created successfully!",
  });
});
export const getDriver = catchAsyncErrors(async (req, res, next) => {
  console.log('ere')
  const id = req.params.id;
  console.log(id)
  const driver = await Driver.findById(id);
  console.log(driver)

  if (!driver) throw Error("User not found!", 404);

  res.json({
    success: true,
    data: { driver },
    message: "User found successfully",
  });
});
export const getDrivers = catchAsyncErrors(async (req, res, next) => {
  const drivers = await Driver.find();
  if (!drivers) throw Error("Users not found!", 404);

  res.json({
    success: true,
    data: { drivers },
    message: "Users found successfully",
  });
});
export const updateDriver = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const updatedDriver = await Driver.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedDriver) throw Error("Driver not found!", 404);

  res.json({
    success: true,
    message: "Driver updated successfully!",
    data: { driver: updatedDriver },
  });
});
export const deleteDriver = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const driver = await Driver.findByIdAndDelete(id);

  if (!driver) throw Error("Driver not found!", 404);
  const newDrivers = await Driver.find();
  res.json({
    success: true,
    message: "Driver deleted successfully!",
    data: {
      drivers: newDrivers,
    },
  });
});
