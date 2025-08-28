import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    transportCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportCompany",
      required: true,
    },
    plan: {
      type: String,
      enum: ["Basic", "Team", "Company", "Enterprise"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "expired", "cancelled"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    features: {
      maxVehicles: { type: Number, default: 10 },
      maxRoutes: { type: Number, default: 20 },
      maxStudents: { type: Number, default: 500 },
      gpsTracking: { type: Boolean, default: true },
      rfidCards: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      maintenanceTickets: { type: Boolean, default: true },
      reports: { type: Boolean, default: true },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;