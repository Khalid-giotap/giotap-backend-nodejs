import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Student from "../../models/student.model.js";
import { createError } from "../../utils/error.js";

export const addStudent = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;

  let student = await Student.findOne({ email });

  if (student)
    throw createError("Student with same email already exists!", 400);

  student = await Student.create({
    ...req.body,
  });

  await School.findByIdAndUpdate(req.body.schoolId, {
    $inc: { noOfStudents: 1 },
  });

  if (!student)
    throw createError("Some error occurred adding student, Try again!", 400);
  res.json({
    success: true,
    data: { student },
    message: "Student added successfully!",
  });
});

export const addStudents = catchAsyncErrors(async (req, res) => {
  const students = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    throw Error("Please provide an array of managers");
  }

  // Add createdBy automatically if needed

  const createdStudents = await Student.insertMany(students);

  if (!createdStudents)
    throw Error("Some error occurred adding students, Try again!");

  const totalCount = await Student.countDocuments();

  res.status(201).json({
    success: true,
    data: {
      students: createdStudents,
      totalCount,
      totalPages: Math.ceil(totalCount / 10),
    },
    message: "Students added successfully",
  });
});

export const getStudents = catchAsyncErrors(async (req, res) => {
  const students = await Student.find({});
  res.json({
    success: true,
    data: { students },
    message: "Students fetched successfully!",
  });
});
