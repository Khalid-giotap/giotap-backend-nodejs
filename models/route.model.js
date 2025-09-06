import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Route Name is required"],
      trim: true,
      minlength: [5, "Route name must be at least 15 characters long"],
    },
    startLocation: {
      lat: {
        type: Number,
        required: [true, "Start Location latitude is required"],
      },
      lng: {
        type: Number,
        required: [true, "Start Location longitude is required"],
      },
      name: {
        type: String,
        required: [true, "Start Location name is required"],
        trim: true,
      },
    },
    endLocation: {
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
    transportCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportCompany",
      default: null,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      index: true,
      default: null,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    stops: [
      {
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
        passed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    distance: {
      type: Number,
    },
    duration: {
      type: Number,
    },
  },
  { timestamps: true }
);

RouteSchema.index({ name: 1 }, { unique: true });
// Add performance indexes (schoolId already has index: true)
RouteSchema.index({ transportCompanyId: 1 });
RouteSchema.index({ driverId: 1 });
RouteSchema.index({ vehicleId: 1 });
RouteSchema.index({ aideId: 1 });

const Route = mongoose.model("Route", RouteSchema);

export default Route;
