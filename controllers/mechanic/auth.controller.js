import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Mechanic from "../../models/mechanic.model.js";
import PasswordReset from "../../models/password-reset.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signIn = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) throw Error("Email and password are required", 400);

  const user = await Mechanic.findOne({ email }).select("+password");

  if (!user) {
    throw Error("Invalid credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw Error("Invalid credentials");
  }

  const token = user.getSignedToken();

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: "strict",
    })
    .status(200)
    .json({
      success: true,
      data: { user },
      message: "Signed in successfully!",
    });
});

export const signOut = catchAsyncErrors(async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .status(200)
    .json({
      success: true,
      data: { user: null },
      message: "Signed out successfully!",
    });
});

export const aboutMe = catchAsyncErrors(async (req, res) => {
  if (!req.user) {
    throw Error("You're are unauthorized!");
  }

  res.json({
    success: true,
    data: { user: req.user },
    message: "Authentication successful!",
  });
});

export const changePassword = catchAsyncErrors(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword) throw Error("Old password is required!");
  if (!newPassword) throw Error("New password is required!");

  if (!req.user) throw Error("You are not authorized!");

  const user = await Mechanic.findById(req.user.id).select("+password");

  if (!user)
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({
        success: false,
        data: { user: null },
        message: "You're not authorized, You have been signed out!",
      });

  const isPasswordMatch = await user.comparePassword(oldPassword);

  if (!isPasswordMatch)
    throw Error("Old Password is incorrect, Try again!", 400);

  user.password = newPassword;
  await user.save();

  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .json({
      success: true,
      data: { user: null },
      message: "Password changed, you are signed out!",
    });
});

export const requestPasswordReset = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;
  if (!email) throw Error("Email is required");

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minute

  await PasswordReset.create({
    email,
    token,
    expiresAt: expires,
  });

  console.log(`http://localhost:4000/auth/forgot-password?token=${token}`);

  //todo   Send url to email
  res.json({
    success: true,
    message: "Reset email sent successfully!",
  });
});

export const resetPassword = catchAsyncErrors(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!newPassword) throw Error("New Password is required!");
  if (!token) throw Error("Token is required!");

  const resetRecord = await PasswordReset.findOne({ token, used: false });

  if (!resetRecord) throw Error("Invalid or expired token");

  const user = await Mechanic.findOne({ email: resetRecord.email });
  if (!user) throw Error("User not found");

  if (resetRecord.expiresAt < new Date()) {
    throw Error("Token expired");
  }

  user.password = newPassword;
  await user.save();

  resetRecord.used = true;
  await resetRecord.save();

  res.json({
    success: true,
    message: "Password reset successful, please sign in!",
  });
});
