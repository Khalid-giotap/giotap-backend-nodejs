import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "School Name is required"],
      trim: true,
      minlength: [15, "School name must be at least 15 characters long"],
      maxlength: [150, "School name must be at most 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    address: {
      address_line1: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      postal_code: {
        type: Number,
      },
      landmark: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
    logo: {
      type: String,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
  },
  { timestamps: true }
);

const School = mongoose.model("School", SchoolSchema);

export default School;
