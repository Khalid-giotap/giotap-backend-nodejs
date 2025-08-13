import Admin from "../../models/admin.model.js";
import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";

export const signUp = catchAsyncErrors(async (req, res) => {
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

export const signIn = catchAsyncErrors(async (req, res) => {
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
      sameSite: "strict",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    }) // 7 days
    .status(200)
    .json({
      success: true,
      data: {
        token,
        user: userExist,
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

  const user = await Admin.findById(req.user._id).select("+password");
  if (!user) {
    throw Error("Some error Occurred! please try again!", 404);
  }

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatch)
    throw Error("Old Password is incorrect, Try again!", 400);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  // Update user password here...
  await User.updateOne(
    { email: resetRecord.email },
    { password: hashedPassword }
  );

  // Mark token as used
  resetRecord.used = true;
  await resetRecord.save();

  res.json({ message: "Password reset successful, please sign in!" });
});
