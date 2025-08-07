import express from "express";
import { PORT } from "./config/env";
import authRouter from "./routes/auth/auth.route";
const app = express();
const _PORT = PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to Giotap Backend API");
});

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.listen(_PORT, () => {
  console.log(`Server is running on port http://localhost:${_PORT}`);
});
