import { catchAsyncErrors } from "../../middlewares/async_errors.middleware.js";
import Aide from "../../models/aide.model.js";
import Driver from "../../models/driver.model.js";
import Mechanic from "../../models/mechanic.model.js";
import ParkingLot from "../../models/parking-lot.model.js";
import Route from "../../models/route.model.js";
import SiteManager from "../../models/site-manager.model.js";
import Student from "../../models/student.model.js";
import TransportCompany from "../../models/transport-company.model.js";
import Vehicle from "../../models/vehicle.model.js";

export const getTransportCompanyStatistics = catchAsyncErrors(
  async (req, res) => {
    const drivers = await Driver.countDocuments({
      transportCompanyId: req.user.transportCompanyId.toString(),
    });
    const routes = await Route.countDocuments({
      transportCompanyId: req.user.transportCompanyId.toString(),
    });
    const lots = await ParkingLot.countDocuments({
      transportCompanyId: req.user.transportCompanyId.toString(),
    });
    const vehicles = await Vehicle.countDocuments({
      transportCompanyId: req.user.transportCompanyId.toString(),
    });
    const schools = (
      await TransportCompany.findById(req.user.transportCompanyId.toString())
    )?.schools.length;
    const aides = await Aide.countDocuments({
      transportCompanyId: req.user.transportCompanyId.toString(),
    });
    const mechanics = await Mechanic.countDocuments({
      transportCompanyId: req.user.transportCompanyId.toString(),
    });
    const managers = await SiteManager.countDocuments({
      transportCompanyId: req.user.transportCompanyId.toString(),
    });

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          drivers,
          routes,
          lots,
          vehicles,
          schools,
          aides,
          mechanics,
          managers,
        },
      },

      message: "Statistics fetched successfully",
    });
  }
);

export const getSchoolStatistics = catchAsyncErrors(async (req, res) => {
  res.json({
    success: true,
    message: "School statistics fetched successfully",
  });
});

export const getDashboardStatistics = catchAsyncErrors(async (req, res) => {
  res.json({
    success: true,
    message: "Dashboard statistics fetched successfully",
  });
});
