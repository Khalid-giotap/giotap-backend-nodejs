import mongoose from "mongoose";

const StopSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Stop name is required"],
      trim: true,
    },
    location: {
      lat: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      lng: {
        type: Number,
        required: [true, "Longitude is required"],
      },
      address: {
        type: String,
        trim: true,
      },
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    estimatedTime: {
      type: String, // "HH:MM" format
      required: true,
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    }],
    transportCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportCompany",
      required: true,
    },
  }, { timestamps: true });

const Stop = mongoose.model("Stop", StopSchema);

export default Stop;