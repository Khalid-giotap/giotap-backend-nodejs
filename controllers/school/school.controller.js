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
    routes: req.body.routes || [],
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
    admin : c.admin ? c.admin : null,
    routes: c.routes || [],
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
  let school = await School.findById(id)
    .populate({
      path: "routes",
      select: "name description startLocation endLocation stops status",
      populate: [
        {
          path: "vehicleId",
          select: "plateNumber model capacity status currentLocation"
        },
        {
          path: "driverId",
          select: "fullName licenseId phone email isOnDuty"
        },
        {
          path: "aideId",
          select: "fullName phone email isOnDuty"
        }
      ]
    })
    .populate("createdBy", "fullName email");
  if (!school) throw Error("Invalid resource, School does not exist!");
  const students = await Student.find({ schoolId: school._id });

  res.status(200).json({
    success: true,
    data: { school, students },
    message: "School found successfully!",
  });
});

export const updateSchool = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to update school!");
  
  let school = await School.findById(id);
  if (!school) throw Error("Invalid resource, School does not exist!");

  // Check if email/phone/name already exists for another school
  const existingSchool = await School.findOne({
    _id: { $ne: id },
    $or: [
      { email: req.body.email },
      { phone: req.body.phone },
      { name: req.body.name }
    ]
  });
  
  if (existingSchool) {
    throw Error("School with this email, phone, or name already exists");
  }

  school = await School.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true }
  ).populate("routes", "name description startLocation endLocation")
   .populate("createdBy", "fullName email");

  res.status(200).json({
    success: true,
    data: { school },
    message: "School updated successfully!",
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
  const { page = 1, limit = 10, search, status } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } }
    ];
  }

  if (status) {
    query.status = status;
  }

  const schools = await School.find(query)
    .populate({
      path: "routes",
      select: "name description startLocation endLocation stops status",
      populate: [
        {
          path: "vehicleId",
          select: "plateNumber model capacity status currentLocation"
        },
        {
          path: "driverId",
          select: "fullName licenseId phone email isOnDuty"
        },
        {
          path: "aideId",
          select: "fullName phone email isOnDuty"
        }
      ]
    })
    .populate("admin", "fullName email")
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalCount = await School.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      schools,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
    },
    message: "Schools found successfully!",
  });
});

export const getAvailableSchools = catchAsyncErrors(async (req, res) => {
  const { search } = req.query;

  const query = { status: "active" };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const schools = await School.find(query)
    .populate({
      path: "routes",
      select: "name description startLocation endLocation stops status",
      populate: [
        {
          path: "vehicleId",
          select: "plateNumber model capacity status currentLocation"
        },
        {
          path: "driverId",
          select: "fullName licenseId phone email isOnDuty"
        },
        {
          path: "aideId",
          select: "fullName phone email isOnDuty"
        }
      ]
    })
    .select("name email phone location routes status");

  res.status(200).json({
    success: true,
    data: { schools },
    message: "Available schools found successfully!",
  });
});

export const deleteSchools = catchAsyncErrors(async (req, res) => {
  console.log("🚨 deleteSchools called at:", new Date().toISOString());
  const schools = await School.deleteMany({});

  if (!schools) throw Error("Invalid resource schools not found!");

  res.status(200).json({
    success: true,
    data: { schools },
    message: "Schools deleted successfully!",
  });
});
