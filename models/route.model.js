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
    aideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aide",
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
const Route = mongoose.model("Route", RouteSchema);

export default Route;
