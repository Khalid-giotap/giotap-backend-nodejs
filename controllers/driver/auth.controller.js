import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Driver from "../../models/driver.model.js";

import PasswordReset from "../../models/password-reset.model.js";

export const signIn = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  const user = await Driver.findOne({ email }).select("+password");
  if (!user) {
    throw Error("Invalid credentials!", 400);
  }
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw Error("Invalid credentials!", 400);
  }

  const token = user.getSignedToken();
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }) // 7 days
    .status(201)
    .json({
      success: true,
      data: {
        token,
        user,
      },
      message: "Signed in successfully!",
    });
});

export const aboutMe = catchAsyncErrors(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: { user: req.user },
    message: "User details fetched successfully!",
  });
});

export const signOut = catchAsyncErrors(async (req, res, next) => {
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

  const user = await Driver.findById(req.user.id).select("+password");
  if (!user) {
    throw Error("Some error Occurred! please try again!", 404);
  }

  const isPasswordMatch = await user.comparePassword(oldPassword);
  if (!isPasswordMatch)
    throw Error("Old Password is incorrect, Try again!", 400);

  // password will be hashed in pre save method
  user.password = newPassword;
  await user.save();

  res
    .cookie("token", null) // 7 days
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
  if (!newPassword) throw Error("New password is required!");
  if (!token) throw Error("Token is required!");

  const resetRecord = await PasswordReset.findOne({ token, used: false });
  if (!resetRecord) {
    throw Error("Invalid or expired token");
  }

  if (resetRecord.expiresAt < new Date()) {
    throw Error("Token expired");
  }

  // Update user password here...
  await Driver.updateOne(
    { email: resetRecord.email },
    { password: newPassword }
  );

  // Mark token as used
  resetRecord.used = true;
  await resetRecord.save();

  res.json({ message: "Password reset successful, please sign in!" });
});
