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
    transportCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportCompany",
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

// Add performance indexes (lot already has unique index)
ParkingLotSchema.index({ transportCompanyId: 1 });
ParkingLotSchema.index({ vehicleId: 1 });
ParkingLotSchema.index({ isEmpty: 1 });

const ParkingLot = mongoose.model("ParkingLot", ParkingLotSchema);

export default ParkingLot;
