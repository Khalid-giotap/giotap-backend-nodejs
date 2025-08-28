import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import School from "../../models/school.model.js";
import Student from "../../models/student.model.js";

export const addSchool = catchAsyncErrors(async (req, res) => {
  const { name, email, phone } = req.body;
  console.log(req.body);
  let school = await School.findOne({ $or: [{ email }, { phone }, { name }] });
  if (school) {
    throw Error("School already exists");
  }
  school = await School.create({
    ...req.body,
    createdBy: req.user._id,
    routeId: req.body.routeId || null,
  });
  if (!school) throw Error("Some error adding school, Try again!");

  res.status(201).json({
    success: true,
    data: { school },
    message: "School added successfully!",
  });
});

export const addSchools = catchAsyncErrors(async (req, res) => {
  const schools = req.body;

  if (!Array.isArray(schools) || schools.length === 0) {
    return res
      .status(400)
      .json({ error: "Please provide an array of schools" });
  }

  // Add createdBy automatically if needed
  const schoolsToInsert = schools.map((c) => ({
    ...c,
    createdBy: req.user._id,
  }));

  const createdSchools = await School.insertMany(schoolsToInsert);

  if (!createdSchools) throw Error("Some error adding schools, Try again!");


  res.status(201).json({
    success: true,
    data: {
      schools: createdSchools,
    },
    message: "Schools added successfully",
  });
});

export const getSchool = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to find school!");
  let school = await School.findById(id);
  if (!school) throw Error("Invalid resource, School does not exist!");
  const students = await Student.find({ schoolId: school._id });

  res.status(200).json({
    success: true,
    data: { school, students },
    message: "School found successfully!",
  });
});

export const deleteSchool = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to find school!");
  let school = await School.findByIdAndDelete(id);
  if (!school) throw Error("Invalid resource, School does not exist!");

  res.status(200).json({
    success: true,
    data: { school },
    message: "School deleted successfully!",
  });
});

export const getSchools = catchAsyncErrors(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const query = {};

  if (search) {
    query.$or = [{ name: { $regex: search, $options: "i" } }];
  }

  const schools = await School.find(query)
    .populate("routeId")
    .skip((page - 1) * limit)
    .limit(limit);

  const totalCount = await School.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      schools,
      totalCount,
      totalPages: Math.ceil(totalCount / 10),
      currentPage: page,
    },
    message: "School found successfully!",
  });
});

export const getAvailableSchools = catchAsyncErrors(async (req, res) => {
  const query = {
    routeId: null,
  };
  
  const schools = await School.find(query);
  console.log(schools);
  res.status(200).json({
    success: true,
    data: {
      schools,
    },
    message: "Available Schools found successfully!",
  });
});

export const deleteSchools = catchAsyncErrors(async (req, res) => {
  const schools = await School.deleteMany({});

  if (!schools) throw Error("Invalid resource schools not found!");

  res.status(200).json({
    success: true,
    data: { schools },
    message: "Schools deleted successfully!",
  });
});
