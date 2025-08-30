import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();

import errorHandler from "./middlewares/error.middleware.js";
import { dbConnect } from "./database/db.js";
import { apiLimiter, authLimiter } from "./middlewares/rateLimit.middleware.js";

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
import companyRoutes from "./routes/transport-company/company.route.js";
import schoolRoutes from "./routes/school/school.route.js";
import parentRoutes from "./routes/parent/parent.route.js";
import parentAuthRoutes from "./routes/parent/auth.route.js";
import studentRoutes from "./routes/student/student.route.js";
import parkingLotRoutes from "./routes/parking-lot/lot.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
const server = createServer(app);

// CORS configuration
const corsOptions = {
  origin:["http://localhost:3050", "http://localhost:3001",'http://localhost:3000','https://giotap-admin-2981.vercel.app/'],
  credentials: true,
  optionsSuccessStatus: 200,
};

const io = new Server(server, {
  cors: corsOptions,
});

// Global socket instance for use in controllers
global.io = io;

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  console.error("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

// todo
// // Rate limiting
// app.use("/api/v1/*/auth", authLimiter);
// app.use("/api/v1", apiLimiter);

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

// Mechanic
app.use("/api/v1/admin/mechanic", mechanicRoutes);
app.use("/api/v1/mechanic/auth", mechanicAuthRoutes);

// Transport Company
app.use("/api/v1/admin/company", companyRoutes);
app.use("/api/v1/admin/parking-lot", parkingLotRoutes);

// School
app.use("/api/v1/admin/school", schoolRoutes);

// Parent
app.use("/api/v1/admin/parent", parentRoutes);
app.use("/api/v1/parent/auth", parentAuthRoutes);

// Parent
app.use("/api/v1/admin/student", studentRoutes);

// Admin
app.use("/api/v1/admin/auth", adminAuthRoutes);
app.use("/api/v1/admin", adminRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to Giotap Backend API");
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join admin room for real-time updates
  socket.on("join-admin", () => {
    socket.join("admin-dashboard");
    console.log("User joined admin dashboard room");
  });

  // Join specific entity rooms
  socket.on("join-drivers", () => {
    socket.join("drivers-updates");
  });

  socket.on("join-vehicles", () => {
    socket.join("vehicles-updates");
  });

  socket.on("join-routes", () => {
    socket.join("routes-updates");
  });

  socket.on("join-students", () => {
    socket.join("students-updates");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Real-time data broadcasting functions
export const broadcastDashboardUpdate = (data) => {
  io.to("admin-dashboard").emit("dashboard-update", data);
};

export const broadcastDriverUpdate = (data) => {
  io.to("drivers-updates").emit("driver-update", data);
};

export const broadcastVehicleUpdate = (data) => {
  io.to("vehicles-updates").emit("vehicle-update", data);
};

export const broadcastRouteUpdate = (data) => {
  io.to("routes-updates").emit("route-update", data);
};

export const broadcastStudentUpdate = (data) => {
  io.to("students-updates").emit("student-update", data);
};

// Error handling middleware
app.use(errorHandler);

// Connect to database and start server
dbConnect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

// Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  console.error("Shutting down the server due to Unhandled Rejection");
  server.close(() => {
    process.exit(1);
  });
});
