import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import errorHandler from "./middlewares/error.middleware.js";
import { dbConnect } from "./database/db.js";

// Routes
import adminAuthRoutes from "./routes/admin/auth.route.js";
import adminRoutes from "./routes/admin/admin.route.js";
import driverRoutes from "./routes/driver/driver.route.js";
import driverAuthRoutes from "./routes/driver/auth.route.js";
import routeRoutes from "./routes/route/route.js";
import vehicleRoutes from "./routes/vehicle/vehicle.route.js";
import aideAuthRoutes from "./routes/aide/auth.route.js";
import aideRoutes from "./routes/aide/aide.route.js";
import siteManagerRoutes from "./routes/site-manager/manager.route.js";
import managerAuthRoutes from "./routes/site-manager/auth.route.js";
import mechanicRoutes from "./routes/mechanic/mechanic.route.js";
import mechanicAuthRoutes from "./routes/mechanic/auth.route.js";

const app = express();
const _PORT = process.env.PORT || 5000;

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log("Error: ", err.message);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3050","http://localhost:3000"],
    credentials: true,
  })
);


//* Apis

// Drivers
app.use("/api/v1/admin/driver", driverRoutes);
app.use("/api/v1/driver/auth", driverAuthRoutes);

// Aide 
app.use("/api/v1/admin/aide", aideRoutes);
app.use("/api/v1/aide/auth", aideAuthRoutes);

// Vehicle & Routes
app.use("/api/v1/admin/route", routeRoutes);
app.use("/api/v1/admin/vehicle", vehicleRoutes);

// Site Manager 
app.use("/api/v1/admin/site-manager", siteManagerRoutes);
app.use("/api/v1/site-manager/auth", managerAuthRoutes);

// Site Manager 
app.use("/api/v1/admin/mechanic", mechanicRoutes);
app.use("/api/v1/mechanic/auth", mechanicAuthRoutes);

// Admin
app.use("/api/v1/admin/auth", adminAuthRoutes);
app.use("/api/v1/admin", adminRoutes);



app.use(errorHandler);

//
app.get("/", (req, res) => {
  res.send("Welcome to Giotap Backend API");
});

dbConnect();
const server = app.listen(_PORT, () => {
  console.log(`Server is running on port http://localhost:${_PORT}`);
});

// Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log("Error: ", err.message);
  console.log("Shutting down the server due to Unhandled Rejection");
  server.close(() => {
    process.exit(1);
  });
});
