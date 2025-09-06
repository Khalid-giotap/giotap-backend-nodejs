import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Aide from "../../models/aide.model.js";
import Driver from "../../models/driver.model.js";
import Route from "../../models/route.model.js";
import School from "../../models/school.model.js";
import Vehicle from "../../models/vehicle.model.js";

export const createRoute = catchAsyncErrors(async (req, res) => {
  const {
    name,
    startLocation,
    endLocation,
    stops,
    transportCompanyId,
    driverId,
    aideId,
    vehicleId,
    schoolId,
  } = req.body;
  if (!name || !startLocation || !endLocation) {
    throw Error("All fields are required!", 400);
  }

  const existingRouteQuery = { name };

  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    existingRouteQuery.transportCompanyId = req.user.transportCompanyId;
  }

  const existingRoute = await Route.findOne(existingRouteQuery);

  if (existingRoute) throw Error("Route already exist with same name!");
  console.log(req.body);
  const route = await Route.create({
    name,
    startLocation,
    stops,
    endLocation,
    ...req.body,
    transportCompanyId:
      req.user.role === "transport-admin"
        ? req.user.transportCompanyId
        : transportCompanyId,
  });

  if (!route) {
    throw Error("Error creating Route!", 400);
  }

  if (driverId) {
    const driver = await Driver.findByIdAndUpdate(driverId, {
      routeId: route._id,
    });
    if (!driver) throw Error("Driver id is invalid!", 404);
  }
  if (aideId) {
    const aide = await Aide.findByIdAndUpdate(aideId, {
      vehicleId: route._id,
    });
    if (!aide) throw Error("Aide id is invalid!", 404);
  }
  if (vehicleId) {
    const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, {
      routeId: route._id,
    });
    if (!vehicle) throw Error("Vehicle id is invalid!", 404);
  }
  if (schoolId) {
    const school = await School.findByIdAndUpdate(schoolId, {
      routes: [...school.routes, route._id],
    });
    if (!school) throw Error("School id is invalid!", 404);
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
  if (!Array.isArray(routes) || routes.length === 0) {
    throw Error("Please provide an array of routes");
  }

  // Add transportCompanyId automatically if needed
  const createdRoutes = routes.map((route) => {
    return {
      ...route,
      transportCompanyId:
        req.user.role === "transport-admin"
          ? req.user.transportCompanyId
          : route.transportCompanyId
          ? route.transportCompanyId
          : null,
    };
  });
  if (!createdRoutes)
    throw Error("Some error occurred creating routes, Try again!");
  await Route.insertMany(createdRoutes);

  const newRoutes = await Route.find({})
    .populate({ path: "driverId", select: "fullName email phone isOnDuty" })
    .populate({ path: "vehicleId", select: "plateNumber" })
    .populate({ path: "aideId", select: "fullName phone" })
    .populate({ path: "schoolId", select: "name" });
  res.status(201).json({
    success: true,
    data: {
      routes: newRoutes,
      totalCount: routes.length,
      totalPages: Math.ceil(totalCount / 10),
    },
    message: "Routes created successfully",
  });
});

export const getRoute = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to get the route!", 400);

  const route = await Route.findById(id)
    .populate({ path: "driverId", select: "fullName" })
    .populate({ path: "vehicleId", select: "plateNumber" })
    .populate({ path: "aideId", select: "name" })
    .populate({ path: "schoolId", select: "name" });

  if (!route) throw Error("Invalid resource, route does not exist!", 404);

  res.json({
    success: true,
    data: { route },
    message: "Route found successfully",
  });
});

export const getAvailableRoutes = catchAsyncErrors(async (req, res) => {
  const query = {
    $or: [
      { driverId: null },
      { vehicleId: null },
      { aideId: null },
      { schoolId: null },
    ],
  };

  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = req.user._id;
  }

  const routes = await Route.find(query);

  if (!routes) throw Error("No available routes found!", 404);

  res.json({
    success: true,
    data: { routes },
    message: "Route found successfully",
  });
});

export const updateRoute = catchAsyncErrors(async (req, res) => {
  const { id } = req.params; // from /:routeId
  const { vehicleId, driverId, schoolId, aideId } = req.body; // from ?vehicle=...&driver=...
  if (vehicleId) {
    const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, { routeId: id });
    if (!vehicle) throw Error("Vehicle id is invalid!", 404);
  }

  if (driverId) {
    const driver = await Driver.findByIdAndUpdate(driverId, {
      routeId: id,
      vehicleId,
    });
    if (!driver) throw Error("Driver id is invalid!", 404);
  }
  if (schoolId) {
    const school = await School.findById(schoolId);
    if (!school) throw Error("School id is invalid!", 404);
    school.routes.push(id);
    await school.save();
  }
  if (aideId) {
    const aide = await Aide.findByIdAndUpdate(
      aideId,
      { vehicleId: id },
      { new: true }
    );
    if (!aide) throw Error("Aide id is invalid!", 404);
  }

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
});

export const deleteRoute = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  if (!id) throw Error("Id is required to delete route!", 400);

  const deleteQuery = { _id: id };

  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    deleteQuery.transportCompanyId = req.user.transportCompanyId;
  }

  const route = await Route.findOneAndDelete(deleteQuery);
  if (!route) throw Error("Invalid resource, route does not exist!", 404);

  res.json({
    success: true,
    data: { route },
    message: "Route deleted successfully!",
  });
});

export const getRoutes = catchAsyncErrors(async (req, res) => {
  const query = {};

  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = req.user.transportCompanyId.toString();
  }

  const routes = await Route.find(query)
    .populate({ path: "driverId", select: "fullName phone isOnDuty licenseId experience" })
    .populate({ path: "vehicleId", select: "plateNumber currentLocation status fuelLevel GPSid filled brand model healthStatus" })
    .populate({ path: "aideId", select: "fullName phone" })
    .populate({ path: "schoolId", select: "name" });
  
  console.log(routes);
  if (!routes) {
    throw Error("Routes not found!", 404);
  }
  res.json({
    success: true,
    data: { routes },
    message: "Routes found successfully",
  });
});

export const deleteRoutes = catchAsyncErrors(async (req, res) => {
  const query = {};

  // Only filter by transportCompanyId for transport-admin, super-admin sees all data
  if (req.user.role === "transport-admin") {
    query.transportCompanyId = req.user.transportCompanyId;
  }

  const routes = await Route.deleteMany(query);
  if (!routes) throw Error("Routes not found!", 404);

  res.json({
    success: true,
    data: { routes },
    message: "Routes deleted successfully!",
  });
});
