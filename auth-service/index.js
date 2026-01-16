require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");

const app = express();

/* =========================
   BASIC MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* =========================
   SERVICE INFO
========================= */
const SERVICE_NAME = process.env.SERVICE_NAME || "AUTH-SERVICE";
const PORT = process.env.PORT || 4001;

console.log(`🚀 Starting ${SERVICE_NAME}...`);

/* =========================
   DATABASE CONNECTION
========================= */
(async () => {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("🔥 Database connection failed:", err.message);
    // Do NOT exit – allow Render to retry
  }
})();

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  res.json({
    service: SERVICE_NAME,
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 AUTH SERVICE ERROR:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

/* =========================
   SERVER
========================= */
const server = http.createServer(app);

server.keepAliveTimeout = 65000; // important for cold start stability
server.headersTimeout = 66000;

server.listen(PORT, () => {
  console.log(`✅ ${SERVICE_NAME} running on port ${PORT}`);
});

/* =========================
   PROCESS SAFETY
========================= */
process.on("unhandledRejection", (reason) => {
  console.error("🔥 UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION:", err);
});
