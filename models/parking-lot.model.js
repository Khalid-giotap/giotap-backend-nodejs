import mongoose from "mongoose";

const ParkingLotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    location: {
      lat: {
        type: String,
      },
      lng: {
        type: String,
      },
      name: {
        type: String,
      },
    },
    lot: {
      type: String,
      unique: true,
      required: true,
    },
    isEmpty: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ParkingLot = mongoose.model("ParkingLot", ParkingLotSchema);

export default ParkingLot;
