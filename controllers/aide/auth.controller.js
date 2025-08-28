import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Aide from "../../models/aide.model.js";
import PasswordReset from "../../models/password-reset.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signIn = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;
  let user = await Aide.findOne({ email }).select("+password");

  if (!user) throw Error("Invalid credentials!");

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) throw Error("Invalid credentials!");

  const token = user.getSignedToken();
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      data: { user },
      message: "Signed in successfully!",
    });
});

export const aboutMe = catchAsyncErrors(async (req, res) => {
  if (!req.user) throw Error("User not found, login again!");

  res.json({
    success: true,
    data: { user: req.user },
    message: "User found successfully!",
  });
});

export const signOut = catchAsyncErrors(async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true, // same as when cookie was set
      secure: true, // same as when cookie was set
      sameSite: "strict", // same as when cookie was set
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
  if (!oldPassword) throw Error("Old password is required!");
  if (!newPassword) throw Error("New password is required!");

  if (!req.user) {
    throw Error("You are not authorized!", 400);
  }

  const user = await Aide.findById(req.user.id).select("+password");
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

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
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
    .status(200)
    .json({
      success: true,
      data: { user: null },
      message: "Password changed, you are signed out!",
    });
});

export const requestPasswordReset = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;

  // Token generate
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minute

  // Save in DB
  await PasswordReset.create({
    email,
    token,
    expiresAt: expires,
  });

  console.log(`http://localhost:4000/auth/forgot-password?token=${token}`);
  // todo Send email to user
  // sendEmail(email, `https://yourapp.com/reset-password?token=${token}`)

  res.json({ success: true, message: "Reset link sent to email" });
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token, newPassword } = req.body;

  const resetRecord = await PasswordReset.findOne({ token, used: false });
  if (!resetRecord) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  if (resetRecord.expiresAt < new Date()) {
    return res.status(400).json({ message: "Token expired" });
  }
  // Update user password here...
  await Aide.updateOne({ email: resetRecord.email }, { password: newPassword });

  // Mark token as used
  resetRecord.used = true;
  await resetRecord.save();

  res.json({ message: "Password reset successful, please sign in!" });
});
