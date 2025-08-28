import mongoose from "mongoose";

const RfidCardSchema = new mongoose.Schema(
  {
    cardNumber: {
      type: String,
      required: [true, "Card number is required"],
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "lost", "damaged"],
      default: "active",
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    activatedDate: {
      type: Date,
    },
    deactivatedDate: {
      type: Date,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    transportCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportCompany",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const RfidCard = mongoose.model("RfidCard", RfidCardSchema);

export default RfidCard;