import mongoose from "mongoose";

const ParkingLotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehile",
      default: null,
    },
    location: {
      lat: Number | String,
      lng: Number | String,
      name: String,
    },
    lot: {
      type: Number,
      required: true,
    },
    isEmtpy: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ParkingLot = mongoose.model("ParkingLot", ParkingLotSchema);

export default ParkingLot;
