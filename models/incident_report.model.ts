import mongoose from "mongoose";

const IncidentReportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["medical", "behavior", "breakdown"],
      default: "behavior",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description must be at most 500 characters long"],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdByModel", // 👈 dynamic ref
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ["Driver", "Aide"], // 👈 models it can point to
    },
    via: {
      type: String,
      enum: ["SMS", "Email", "Push"],
      default: "SMS",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "failed"],
      default: "sent",
    },
  },
  { timestamps: true }
);

const IncidentReport = mongoose.model("IncidentReport", IncidentReportSchema);

export default IncidentReport;
