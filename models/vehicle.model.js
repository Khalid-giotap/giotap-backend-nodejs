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
    transportCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportCompany",
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
    lot: {
      type: mongoose.Schema.Types.ObjectId,
    },
    currentLocation: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
      name: {
        type: String,
        trim: true,
      },
    },
    // Add to vehicle.model.js
    fuelLevel: {
      type: Number, // percentage
      default: 100,
    },
    lastMaintenance: {
      type: Date,
    },
    nextMaintenance: {
      type: Date,
    },
    healthStatus: {
      type: String,
      enum: ["excellent", "good", "fair", "poor"],
      default: "good",
    },
  },
  { timestamps: true }
);

// Add performance indexes (plateNumber already has unique index)
VehicleSchema.index({ status: 1 });
VehicleSchema.index({ transportCompanyId: 1 });
VehicleSchema.index({ routeId: 1 });
VehicleSchema.index({ transportCompanyId: 1, status: 1 });

const Vehicle = mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;
