import { catchAsyncErrors } from "../../middlewares/async_errors.middleware";
import Driver from "../../models/driver.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signIn = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  const driver = await Driver.findOne({ email }).select("+password");
  if (!driver) {
    throw Error("Invalid credentials!", 409);
  }

  const isPasswordMatch = await bcrypt.compare(password, driver.password);
  if (!isPasswordMatch) {
    throw Error("Invalid credentials!", 409);
  }

  const token = jwt.sign({ userId: driver._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }) // 7 days
    .status(201)
    .json({
      success: true,
      data: {
        token,
        user: userExist,
      },
      message: "Sign in Successful!",
    });
});
export const aboutMe = catchAsyncErrors(async (req, res, next) => {
    
  return res.status(200).json({
    success: true,
    data: req.user,
    message: "User details fetched successfully!",
  });
});
export const signOut = catchAsyncErrors(async (req, res, next) => {
  res
    .cookie("token", null) // 7 days
    .status(200)
    .json({
      success: true,
      message: "Sign out Successful!",
    });
});