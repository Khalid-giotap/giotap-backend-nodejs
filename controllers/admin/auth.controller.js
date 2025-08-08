import bcrypt from "bcryptjs";
import Admin from "../../models/admin.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";

export const signUp = catchAsyncErrors(async (req, res, next) => {
  const { fullName, email, password, phone } = req.body;
  const existingUser = await Admin.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    throw Error("Try different credentials!", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(req.body);
  const user = await Admin.create({
    fullName,
    email,
    phone,
    password: hashedPassword,
  });
  const { _id } = user;
  const token = jwt.sign({ userId: _id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.status(201).json({
    success: true,
    data: {
      token,
      user,
    },
    message: "Account Registered Successfully!",
  });
});

export const signIn = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await Admin.findOne({ email }).select("+password");
  if (!userExist) {
    throw Error("Invalid credentials!", 409);
  }

  const isPasswordMatch = await bcrypt.compare(password, userExist.password);
  if (!isPasswordMatch) {
    throw Error("Invalid credentials!");
  }

  const token = jwt.sign({ userId: userExist._id }, process.env.JWT_SECRET, {
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
