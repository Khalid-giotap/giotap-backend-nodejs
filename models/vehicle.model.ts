import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle Number is required"],
      trim: true,
      unique: true,
    },
    licensePlate: {
      type: String,
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    model: {
      type: String,
      ref: "Driver",
      required: [true, "Driver Id is required"],
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
      required: [true, "Route Id is required"],
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
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;
