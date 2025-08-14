import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: [true, "Vehicle Number is required"],
      trim: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    filled: {
      type: Number,
      default: 0,
    },
    model: {
      type: String,
    },
    GPSid: {
      type: String,
      required: [true, "GPS Id is required"],
      unique: true,
    },
    rfidReaderid: {
      type: String,
      required: [true, "RFID Reader Id is required"],
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
    note: {
      type: String,
      trim: true,
      maxlength: [300, "Note must be at most 300 characters long"],
    },
    currentLocation: {
      lat: {
        type: Number,
        required: [true, "End Location latitude is required"],
      },
      lng: {
        type: Number,
        required: [true, "End Location longitude is required"],
      },
      name: {
        type: String,
        required: [true, "End Location name is required"],
        trim: true,
      },
    },
  },
  { timestamps: true }
);

VehicleSchema.index({ plateNumber: 1 }, { unique: true });
const Vehicle = mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;
