import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Parent from "../../models/parent.model.js";
import PasswordReset from "../../models/password-reset.model.js";
import { createError } from "../../utils/error.js";
import jwt from "jsonwebtoken";

export const signIn = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Please provide email and password!");
    error.statusCode = 400;
    throw error;
  }

  const user = await Parent.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid credentials, Try again!");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    const error = new Error("Invalid credentials, Try again!");
    error.statusCode = 401;
    throw error;
  }

  const token = user.getSignedToken();

  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      data: { user },
      message: "Signed in successfully!",
    });
});

export const aboutMe = catchAsyncErrors(async (req, res) => {
  if (!req.user) {
    throw createError("Unauthorized, Please sign in!", 401);
  }
  const user = await Parent.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: { user },
    message: "User details fetched successfully!",
  });
});

export const signOut = catchAsyncErrors(async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({
      success: true,
      data: { user: null },
      message: "Signed out successfully!",
    });
});

export const changePassword = catchAsyncErrors(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw createError("Please provide old and new password!", 400);
  }

  const user = await Parent.findById(req.user._id).select("+password");

  const isPasswordMatch = await user.comparePassword(oldPassword);

  if (!isPasswordMatch) {
    throw createError("Invalid old password!", 400);
  }

  user.password = newPassword;
  await user.save();

  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({
      success: true,
      data: { user: null },
      message: "Password changed successfully, Please sign in again!",
    });
});

export const requestPasswordReset = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;

  if (!email) throw createError("Please provide email!", 400);
  // generate token
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  // create password reset
  await PasswordReset.create({
    email,
    token,
    expiresAt: expires,
  });

  // todo send email
  console.log(`http://localhost:4000/auth/forgot-password?token=${token}`);

  res.json({ success: true, message: "Password reset link sent to email" });
});

export const resetPassword = catchAsyncErrors(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw createError("Please provide token and new password!", 400);
  }

  const passwordReset = await PasswordReset.findOne({ token });

  if (!passwordReset) {
    throw createError("Invalid token!", 400);
  }

  if (passwordReset.expiresAt < Date.now()) {
    throw createError("Token expired!", 400);
  }

  const user = await Parent.findOne({ email: passwordReset.email });

  if (!user) {
    throw createError("User does not found!", 400);
  }

  user.password = newPassword;
  await user.save();

  passwordReset.used = true;
  await passwordReset.save();

  res.json({
    success: true,
    message: "Password reset successful, please sign in!",
  });
});
