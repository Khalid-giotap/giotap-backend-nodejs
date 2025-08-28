import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Route from "../../models/route.model.js";
import School from "../../models/school.model.js";
import Vehicle from "../../models/vehicle.model.js";

export const createRoute = catchAsyncErrors(async (req, res) => {
  console.log(req.body);
  const { name, startLocation, endLocation, stops } = req.body;
  if (!name || !startLocation || !endLocation) {
    throw Error("All fields are required!", 400);
  }

  const existingRoute = await Route.findOne({ name });
  if (existingRoute) throw Error("Route already exist with same name!");

  const route = await Route.create({ name, startLocation, stops, endLocation });

  if (!route) {
    throw Error("Error creating Route!", 400);
  }
  res.status(201).json({
    success: true,
    data: {
      route,
    },
    message: "Route created successfully!",
  });
});

export const createRoutes = catchAsyncErrors(async (req, res) => {
  const routes = req.body;
  console.log(routes);
  if (!Array.isArray(routes) || routes.length === 0) {
    throw Error("Please provide an array of routes");
  }

  // Add createdBy automatically if needed

  const createdRoutes = await Route.insertMany(routes);

  if (!createdRoutes)
    throw Error("Some error occurred creating routes, Try again!");

  const totalCount = await Route.countDocuments();

  res.status(201).json({
    success: true,
    data: {
      routes: createdRoutes,
      totalCount,
      totalPages: Math.ceil(totalCount / 10),
    },
    message: "Routes created successfully",
  });
});

export const getRoute = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to get the route!", 400);

  const route = await Route.findById(id).populate("driverId").populate("vehicleId").populate("aideId").populate("schoolId");

  if (!route) throw Error("Invalid resource, route does not exist!", 404);

  res.json({
    success: true,
    data: { route },
    message: "Route found successfully",
  });
});

export const updateRoute = catchAsyncErrors(async (req, res) => {
  const { id } = req.params; // from /:routeId
  const { vehicle, driver,school } = req.query; // from ?vehicle=...&driver=...
  if (vehicle && driver) {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicle,
      {
        id,
      },
      { new: true }
    );
    const updatedRoute = await Route.findByIdAndUpdate(
      id,
      {
        driverId: driver,
        vehicleId: vehicle,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      data: {
        route: updatedRoute,
        vehicle: updatedVehicle,
      },
      success: true,
      message: "Route assigned successfully!",
    });
  }
  if (school) {
    const updatedSchool = await School.findByIdAndUpdate(
      school,
      {
        routeId:id,
      },
      { new: true }
    );
    const updatedRoute = await Route.findByIdAndUpdate(
      id,
      {
        schoolId: school,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      data: {
        route: updatedRoute,
        school: updatedSchool,
      },
      success: true,
      message: "Route assigned successfully!",
    });
  }
  if (id) {
    const route = await Route.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({
      data: {
        route,
      },
      success: true,
      message: "Route updated successfully!",
    });
  }
});

export const deleteRoute = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to delete route!", 400);

  const route = await Route.findByIdAndDelete(id);
  if (!route) throw Error("Invalid resource, route does not exist!", 404);

  res.json({
    success: true,
    data: { route },
    message: "Route deleted successfully!",
  });
});

export const getRoutes = catchAsyncErrors(async (req, res) => {
  const routes = await Route.find().populate("driverId").populate("vehicleId").populate("aideId").populate("schoolId");

  if (!routes) {
    throw Error("Routes not found!", 404);
  }
  console.log(routes);
  res.json({
    success: true,
    data: { routes },
    message: "Routes found successfully",
  });
});

export const deleteRoutes = catchAsyncErrors(async (req, res) => {
  const routes = await Route.deleteMany();
  if (!routes) throw Error("Routes not found!", 404);

  res.json({
    success: true,
    data: { routes },
    message: "Routes deleted successfully!",
  });
});
