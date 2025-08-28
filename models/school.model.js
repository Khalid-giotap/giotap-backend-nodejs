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
    location: {
      lng: {
        type: String,
        required: [true, "Longitude is required"],
        trim: true,
      },
      lat: {
        type: String,
        required: [true, "Latitude is required"],
        trim: true,
      },
      name: {
        type: String,
        trim: true,
      },
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be at most 500 characters long"],
      default: "No description provided",
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },
    isActive: {
      type: String,
      enum: ["active", "inactive", "pending", "suspended"],
      default: "active",
    },
    noOfStudents: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

SchoolSchema.index({ email: 1, phone: 1, name: 1 });
const School = mongoose.model("School", SchoolSchema);

export default School;
