import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import bcrypt from "bcryptjs";
import SiteManager from "../../models/site-manager.model.js";
import jwt from "jsonwebtoken";
import PasswordReset from "../../models/password-reset.model.js";

export const signIn = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw Error("Email and password are required", 400);

  let user = await SiteManager.findOne({ email }).select("+password");
  if (!user) throw Error("Invalid credentials, Try again!", 400);

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) throw Error("Invalid credentials, Try again!", 400);

  const token = user.getSignedToken();

  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
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
      sameSite: "none",
      secure: true,
    })
    .json({
      success: true,
      data: { user: null },
      message: "Signed out successfully!",
    });
});

export const aboutMe = catchAsyncErrors(async (req, res) => {
  if (!req.user) throw Error("You are not Authorized!", 400);

  const user = await SiteManager.findById(req.user.id);
  res.json({
    success: true,
    data: { user },
    message: "Authentication successful!",
  });
});

export const changePassword = catchAsyncErrors(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword) throw Error("Old password is required!");
  if (!newPassword) throw Error("New password is required!");

  if (!req.user) throw Error("You are not authorized!");

  const user = await SiteManager.findById(req.user.id).select("+password");

  if (!user)
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
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
      sameSite: "none",
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
  const user = await SiteManager.findOne({ email });
  if (!user) {
    const error = new Error("Invalid email account not found!");
    error.statusCode = 404;
    throw error;
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minute
  await PasswordReset.create({
    email,
    token,
    expiresAt: expires,
  });


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

  const user = await SiteManager.findOne({ email: resetRecord.email });
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
