import mongoose from "mongoose";

const GpsLogSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: [true, "Route Id is required"],
    },
    lat: {
      type: Number,
      required: [true, "Latitude is required"],
    },
    lng: {
      type: Number,
      required: [true, "Longitude is required"],
    },
    speed: {
      type: Number,
    },
    duration: {
      type: Number,
    },
  },
  { timestamps: true }
);

const GpsLog = mongoose.model("GpsLog", GpsLogSchema);

export default GpsLog;
