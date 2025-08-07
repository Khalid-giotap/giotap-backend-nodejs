import mongoose from "mongoose";

const TapingSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Student Id is required"],
      unique: true,
      ref: "Student",
    },
    rollNumber: {
      type: String,
    },
    direction: {
      type: String,
      enum: ["IN", "OUT"],
      required: [true, "Direction is required"],
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: [true, "Route is required"],
    },
    recordedBy: {
      type: String,
      enum: ["AUTO", "MANUAL", "AIDE"],
      default: "AUTO",
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Taping = mongoose.model("Taping", TapingSchema);

export default Taping;
