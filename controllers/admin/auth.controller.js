import Admin from "../../models/admin.model.js";
import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { alertWelcome } from "../../email-templates/alert.js";
import { sendSms } from "../../utils/sendSms.js";

export const signUp = catchAsyncErrors(async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  let user = await Admin.findOne({
    $or: [{ email }, { phone }],
  });

  if (user) {
    const error = new Error("User with these credentials already exists");
    error.statusCode = 400;
    throw error;
  }

  user = await Admin.create({
    fullName,
    email,
    phone,
    password,
  });

  res.status(201).json({
    success: true,
    data: {
      user,
    },
    message: "Account Registered Successfully!",
  });
});

export const signIn = catchAsyncErrors(async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(req.body);
  const { email, password } = req.body;
  let user = await Admin.findOne({ email }).select("+password");
  console.log(user);
  if (!user) {
    const error = new Error("Invalid credentials!");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await user.comparePassword(password);
  console.log(isPasswordMatch);

  if (!isPasswordMatch) {
    const error = new Error("Invalid credentials!");
    error.statusCode = 401;
    throw error;
  }

  const token = user.getSignedToken();
  console.log("token", token);
  sendEmail(user.email, "Login Alert", alertWelcome(user.fullName));

  return res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      data: {
        user,
      },
      message: "Signed in successfully!",
    });
});

export const aboutMe = catchAsyncErrors(async (req, res) => {
  if (!req.user) {
    const error = new Error("Unauthorized!");
    error.statusCode = 401;
    throw error;
  }

  return res.status(200).json({
    success: true,
    data: { user: req.user },
    message: "User details fetched successfully!",
  });
});

export const signOut = catchAsyncErrors(async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({
      success: true,
      data: { user: null },
      message: "Signed out Successfully!",
    });
});

export const changePassword = catchAsyncErrors(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword) {
    const error = new Error("Old password is required!");
    error.statusCode = 400;
    throw error;
  }

  if (!newPassword) {
    const error = new Error("New password is required!");
    error.statusCode = 400;
    throw error;
  }

  const user = await Admin.findById(req.user.id).select("+password");
  if (!user) {
    const error = new Error("User not found!");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordMatch = await user.comparePassword(oldPassword);

  if (!isPasswordMatch) {
    const error = new Error("Old Password is incorrect, Try again!");
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  await user.save();

  res.clearCookie("token").status(200).json({
    success: true,
    data: { user },
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

  // Send email to user
  try {
    await sendEmail(
      email,
      "Password Reset",
      `Reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`
    );
  } catch (emailError) {
    console.error("Password reset email failed:", emailError.message);
  }

  res.json({ success: true, message: "Reset link sent to email" });
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token, newPassword } = req.body;

  const resetRecord = await PasswordReset.findOne({ token, used: false });
  if (!resetRecord) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 400;
    throw error;
  }

  if (resetRecord.expiresAt < new Date()) {
    const error = new Error("Token expired");
    error.statusCode = 400;
    throw error;
  }

  // Update user password here...
  await User.updateOne({ email: resetRecord.email }, { password: newPassword });

  // Mark token as used
  resetRecord.used = true;
  await resetRecord.save();

  res.json({ message: "Password reset successful, please sign in!" });
});
