import mongoose from "mongoose";
const transportCompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
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
    status: {
      type: String,
      enum: ["active", "suspended", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    schools: [
      { type: mongoose.Schema.Types.ObjectId, ref: "School", required: false },
    ], // Virtual populate
    vehicles: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: false },
    ], // Virtual populate
    // Add to transport-company.model.js
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
   
  },
  { timestamps: true }
);

const TransportCompany = mongoose.model(
  "TransportCompany",
  transportCompanySchema
);
export default TransportCompany;
