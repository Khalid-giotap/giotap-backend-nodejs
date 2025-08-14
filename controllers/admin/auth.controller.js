import Admin from "../../models/admin.model.js";
import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";

export const signUp = catchAsyncErrors(async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  let user = await Admin.findOne({
    $or: [{ email }, { phone }],
  });

  if (user) {
    throw Error("Try different credentials!", 400);
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
  const { email, password } = req.body;
  let user = await Admin.findOne({ email }).select("+password");
  if (!user) {
    throw Error("Invalid credentials!", 409);
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw Error("Invalid credentials!");
  }

  const token = user.getSignedToken();

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }) // 7 days
    .status(200)
    .json({
      success: true,
      data: {
        token,
        user,
      },
      message: "Signed in successfully!",
    });
});

export const aboutMe = catchAsyncErrors(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: { user: req.user },
    message: "User details fetched successfully!",
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
      message: "Signed out Successfully!",
    });
});

export const changePassword = catchAsyncErrors(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword) throw Error("Old password is required!");

  if (!newPassword) throw Error("New password is required!");

  const user = await Admin.findById(req.user.id).select("+password");
  if (!user) {
    throw Error("Some error Occurred! please try again!", 404);
  }

  const isPasswordMatch = await user.comparePassword(oldPassword);

  if (!isPasswordMatch)
    throw Error("Old Password is incorrect, Try again!", 400);

  user.password = newPassword;
  await user.save();

  res
    .cookie("token", null) // 7 days
    .status(200)
    .json({
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
  await User.updateOne({ email: resetRecord.email }, { password: newPassword });

  // Mark token as used
  resetRecord.used = true;
  await resetRecord.save();

  res.json({ message: "Password reset successful, please sign in!" });
});
