require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// db
connectDB();

// routes
app.use("/api/auth", authRoutes);

// health
app.get("/health", (req, res) => {
  res.json({
    service: process.env.SERVICE_NAME,
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// server
const PORT = process.env.PORT || 4001;
http.createServer(app).listen(PORT, () => {
  console.log(`[AUTH-SERVICE] running on port ${PORT}`);
});
