import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Route from "../../models/route.model.js";
import Vehicle from "../../models/vehicle.model.js";

export const createRoute = catchAsyncErrors(async (req, res) => {
  const route = await Route.create(req.body);
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

export const getRoute = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw Error("Id is required to get the route!", 400);

  const route = await Route.findById(id);

  if (!route) throw Error("Invalid resource, route does not exist!", 404);

  res.json({
    success: true,
    data: { route },
    message: "Route found successfully",
  });
});

export const updateRoute = catchAsyncErrors(async (req, res) => {
  const {id} = req.params; // from /:routeId
  const { vehicle, driver } = req.query; // from ?vehicle=...&driver=...
  if (vehicle && driver) {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicle,
      {
        routeId,
      },
      { new: true }
    );
    const updatedRoute = await Route.findByIdAndUpdate(
      routeId,
      {
        driverId: driver,
        vehicleId: vehicle,
      },
      {
        new: true,
      }
    );

    console.log(updatedRoute);

    return res.status(200).json({
      data: {
        route: updatedRoute,
        vehicle: updatedVehicle,
      },
      success: true,
      message: "Route assigned successfully!",
    });
  }
  if (id) {
    console.log(req.body)
    const route = await Route.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    console.log(route);
    const routes = await Route.find();
    return res.status(200).json({
      data: {
        routes,
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
  const routes = await Route.find();

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
  const routes = await Route.deleteMany();
  if (!routes) throw Error("Routes not found!", 404);

  res.json({
    success: true,
    data: { routes },
    message: "Routes deleted successfully!",
  });
});
