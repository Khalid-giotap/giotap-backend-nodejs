import mongoose from "mongoose";

const AlertLogSchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ["Driver", "Aide", "Parent", "Admin"],
      required: [true, "Recipient type is required"],
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Recipient Id is required"],
      refPath: "recipientType", // Dynamic reference based on recipientType
    },
    type: {
      type: String,
      enum: ["delay", "no-tap", "emergency", "other"],
      default: "other",
      required: [true, "Type is required"],
    },
    message: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: [250, "Message must be at most 250 characters long"],
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

const AlertLog = mongoose.model("AlertLog", AlertLogSchema);

export default AlertLog;
