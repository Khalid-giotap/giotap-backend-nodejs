import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const StudentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    grade: {
      type: String,
      required: [true, "Grade is required"],
    },
    rollNumber: {
      type: String,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: [true, "Parent is required"],
    },
    location: {
      lng: {
        type: Number,
        required: [true, "Longitude is required"],
      },
      lat: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      name: {
        type: String,
        required: [true, "Location name is required"],
      },
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School Id is required"],
    },
    specialNotes: {
      type: String,
    },
    rfidTag: {
      type: String,
      unique: true,
      sparse: true,
      maxlength: [20, "RFID tag must be at most 20 characters long"],
    },
    role:{
      type: String,
      default: "student",
    }
  },
  { timestamps: true }
);

StudentSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id, role: "student" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

StudentSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Student = mongoose.model("Student", StudentSchema);

export default Student;
