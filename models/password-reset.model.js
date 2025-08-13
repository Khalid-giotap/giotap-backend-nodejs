import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// Optional: Index to auto-delete expired reset requests
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema);

export default PasswordReset;
