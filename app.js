import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import errorHandler from "./middlewares/error.middleware.js";
import { dbConnect } from "./database/db.js";

// Routes
import adminRoutes from "./routes/admin/auth/auth.route.js";
import driverRoutes from "./routes/drivers/driver/driver.route.js";
import driverAuthRoutes from "./routes/drivers/auth/auth.route.js";

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

//* Apis
// Admin
app.use("/api/v1/admin/auth", adminRoutes);
app.use("/api/v1/admin/drivers/driver", driverRoutes);
app.use("/api/v1/admin/drivers/auth", driverAuthRoutes);

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
