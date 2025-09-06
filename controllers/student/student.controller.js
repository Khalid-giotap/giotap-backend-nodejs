import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Student from "../../models/student.model.js";
import School from "../../models/school.model.js";
import { createError } from "../../utils/error.js";

export const addStudent = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;

  let student = await Student.findOne({ email });

  if (student)
    throw createError("Student with same email already exists!", 400);

  student = await Student.create({
    ...req.body,
    transportCompanyId: req.user.role === "transport-admin" ? req.user._id : req.body.transportCompanyId,
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

  const newStudents = students.map((student) => {
    return {
      ...student,
      transportCompanyId: req.user.role === "transport-admin" ? req.user._id : student.transportCompanyId,
    };
  }); 
  const createdStudents = await Student.insertMany(newStudents);

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
  const query = {};
  
  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = req.user._id;
  }

  const students = await Student.find(query);
  if (!students) throw Error("Invalid resource, students does not exist!", 404);
  res.json({
    success: true,
    data: { students },
    message: "Students fetched successfully!",
  });
});

export const deleteStudents = catchAsyncErrors(async (req, res) => {
  const query = {};
  
  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = req.user._id;
  }

  const students = await Student.deleteMany(query);
  if (!students) throw Error("Invalid resource, students does not exist!", 404);
  res.json({
    success: true,
    data: { students },
    message: "Students deleted successfully!",
  });
}); 