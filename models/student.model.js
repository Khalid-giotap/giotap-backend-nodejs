import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    class: {
      type: String,
      required: [true, "Class is required"],
    },
    rollNumber: {
      type: String,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: [true, "Parent is required"],
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: [true, "Route is required"],
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
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
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);

export default Student;