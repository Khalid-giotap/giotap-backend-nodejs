import mongoose from "mongoose";

const MaintenanceTicketSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "reportedByModel",
      required: true,
    },
    reportedByModel: {
      type: String,
      enum: ["SiteManager", "Driver", "Aide"],
      required: true,
    },
    transportCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportCompany",
      required: true,
    },
    estimatedCost: {
      type: Number,
    },
    actualCost: {
      type: Number,
    },
    completedAt: {
      type: Date,
    },
  }, { timestamps: true });