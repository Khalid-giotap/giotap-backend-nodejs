import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Parent from "../../models/parent.model.js";
import Student from "../../models/student.model.js";
import { createError } from "../../utils/error.js";

export const createParent = catchAsyncErrors(async (req, res) => {
  const { phone, email } = req.body;

  let parent = await Parent.findOne({ $or: [{ email }, { phone }] });

  if (parent) throw Error("Parent already exist with same email or phone");

  parent = await Parent.create({
    ...req.body,
  });

  if (!parent) throw Error("Some error occurred creating parent, Try again!");

  res.status(201).json({
    success: true,
    data: {
      parent,
    },
    message: "Parent created successfully",
  });
});

export const createParents = catchAsyncErrors(async (req, res) => {
  const parents = req.body;
  if (!Array.isArray(parents) || parents.length === 0)
    throw Error("Please provide an array of parents");

  const createdParents = await Parent.insertMany(parents, {
    ordered: false,
  });

  if (!createdParents)
    throw Error("Some error occurred adding parents, Try again!");

  const totalCount = await Parent.countDocuments();

  res.status(201).json({
    success: true,
    data: {
      parents: createdParents,
      totalCount,
      totalPages: Math.ceil(totalCount / 10),
    },
    message: "Parents created successfully!",
  });
});

export const getParents = catchAsyncErrors(async (req, res) => {
  const { page = 1, limit = 10, search = "", status = true } = req.query;
  let query = {};
  if (search && search.trim() !== "") {
    query = {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
  }
  const parents = await Parent.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  if (!parents) throw Error("Some error occurred, Try again!");

  const totalCount = await Parent.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      parents,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    },
    message: "Parents found successfully!",
  });
});

export const getParent = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to find the parent!");

  const parent = await Parent.findById(id);

  if (!parent)
    throw Error("Invalid resource parent does not exist, Try again!");

  res.status(200).json({
    success: true,
    data: {
      parent,
    },
    message: "Parent found successfully!",
  });
});

export const updateParent = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to find the parent!");

  const parent = await Parent.findByIdAndUpdate(id, req.body, { new: true });

  if (!parent)
    throw Error("Invalid resource parent does not exist, Try again!");

  res.status(200).json({
    success: true,
    data: {
      parent,
    },
    message: "Parent updated successfully!",
  });
});

export const deleteParent = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to find the parent!");

  const parent = await Parent.findByIdAndDelete(id);

  if (!parent)
    throw Error("Invalid resource parent does not exist, Try again!");

  //   todo delete the children linked with parents

  res.status(200).json({
    success: true,
    data: {
      parent,
    },
    message: "Parent deleted successfully!",
  });
});

export const deleteParents = catchAsyncErrors(async (req, res) => {
  const parents = await Parent.deleteMany();

  if (!parents) throw Error("Invalid resource parents not found, Try again!");

  //   todo delete the children linked with parents

  res.status(200).json({
    success: true,
    data: {
      parents,
    },
    message: "Parents deleted successfully!",
  });
});

export const getChildren = catchAsyncErrors(async (req, res) => {
  const parentId = req.user._id;

  const children = await Student.find({ parent: parentId });

  if (!children) throw createError("No children found, Try again!");

  res.status(200).json({
    success: true,
    data: {
      children,
    },
    message: "Children found successfully!",
  });
});

export const getChild = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  const child = await Student.findById(id);

  if (!child) throw createError("No child found, Try again!");

  res.status(200).json({
    success: true,
    data: {
      child,
    },
    message: "Children found successfully!",
  });
});
