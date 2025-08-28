import mongoose from "mongoose";

const AttendanceReportSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    transportCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportCompany",
      required: true,
    },
    totalStudents: {
      type: Number,
      required: true,
    },
    presentStudents: {
      type: Number,
      default: 0,
    },
    absentStudents: {
      type: Number,
      default: 0,
    },
    onTimePercentage: {
      type: Number,
      default: 0,
    },
    delays: [
      {
        reason: String,
        duration: Number, // in minutes
        timestamp: Date,
      },
    ],
    incidents: [
      {
        type: String,
        description: String,
        timestamp: Date,
      },
    ],
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const AttendanceReport = mongoose.model("AttendanceReport", AttendanceReportSchema);

export default AttendanceReport;
