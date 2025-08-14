import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import TransportCompany from "../../models/transport-company.model.js";
import Vehicle from "../../models/vehicle.model.js";
import School from "../../models/school.model.js";
import Admin from "../../models/admin.model.js";
import SiteManager from "../../models/site-manger.model.js";

export const createCompany = catchAsyncErrors(async (req, res) => {
  let company = await TransportCompany.findOne({ name: req.body.name });

  if (company) throw Error("Company already exists!", 400);

  company = await TransportCompany.create({
    ...req.body,
    createdBy: req.user.id,
  });

  console.log(company);

  if (!company) throw Error("Error creating company, Try again!", 400);

  res.status(201).json({
    success: true,
    data: { company },
    message: "Company created successfully!",
  });
});

export const createCompanies = catchAsyncErrors(async (req, res) => {
  const { companies } = req.body;

  if (!Array.isArray(companies) || companies.length === 0) {
    return res
      .status(400)
      .json({ error: "Please provide an array of companies" });
  }

  // Add createdBy automatically if needed
  const companiesToInsert = companies.map((c) => ({
    ...c,
    createdBy: req.user.id,
  }));

  const createdCompanies = await TransportCompany.insertMany(
    companiesToInsert,
    {
      ordered: false,
    }
  );

  if (!createdCompanies)
    throw Error("Some error creating companies, Try again!");

  const totalCount = await TransportCompany.countDocuments();

  res.status(201).json({
    success: true,
    data: {
      companies: createdCompanies,
      totalCount,
      totalPages: Math.ceil(totalCount / 10),
    },
    message: "Companies created successfully",
  });
});

export const getCompanies = catchAsyncErrors(async (req, res) => {
  const { page = 1, limit = 10, search = "", status = "active" } = req.query;

  const query = {
    name: { $regex: search, $options: "i" },
    status,
  };

  const companies = await TransportCompany.find(query)
    .populate("createdBy", {
      fullName: 1,
      email: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalCount = await TransportCompany.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      companies,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    },
    message: "Companies fetched successfully!",
  });
});

export const getCompany = catchAsyncErrors(async (req, res) => {
  // Response: { company: {...}, schools: [...], vehicles: [...] }
  // Populate: Associated schools and vehicles
  const { id } = req.params;
  const company = await TransportCompany.findById(id).populate("createdBy", {
    fullName: 1,
    email: 1,
  });

  console.log(company);
  if (!company) throw Error("Company not found!", 404);
  const vehicles = await Vehicle.find({ company: id });
  const schools = await School.find({ company: id });
  company.vehicles = vehicles;
  company.schools = schools;

  res.status(200).json({
    success: true,
    data: { company },
    message: "Company fetched successfully!",
  });
});

export const updateCompany = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, email, status, schoolId, vehicleId } = req.body;

  // Create update object with only provided fields
  const updateFields = {};

  if (name !== undefined) updateFields.name = name;
  if (address !== undefined) updateFields.address = address;
  if (phone !== undefined) updateFields.phone = phone;
  if (email !== undefined) updateFields.email = email;
  if (status !== undefined) updateFields.status = status;

  let company = await TransportCompany.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found!",
    });
  }

  // Handle school and vehicle associations if provided
  if (schoolId) {
    if (!company.schools.includes(schoolId)) {
      company.schools.push(schoolId);
    }
  }

  if (vehicleId) {
    if (!company.vehicles.includes(vehicleId)) {
      company.vehicles.push(vehicleId);
    }
  }

  await company.save();

  res.status(200).json({
    success: true,
    data: { company },
    message: "Company updated successfully!",
  });
});

export const deleteCompany = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const company = await TransportCompany.findByIdAndDelete(id);
  await Admin.findOneAndUpdate(
    { transportCompanyId: id },
    { transportCompanyId: null }
  );
  await SiteManager.findOneAndUpdate(
    { transportCompanyId: id },
    { transportCompanyId: null }
  );

  if (!company) throw Error("Invalid resource, Company does not exist!", 404);

  res.status(200).json({
    success: true,
    data: { company },
    message: "Company deleted successfully!",
  });
});

export const deleteCompanies = catchAsyncErrors(async (req, res) => {
  const companies = await TransportCompany.deleteMany();

  if (!companies) throw Error("Invalid resource, Companies not found!", 404);

  res.status(200).json({
    success: true,
    data: { company },
    message: "Companies deleted successfully!",
  });
});
