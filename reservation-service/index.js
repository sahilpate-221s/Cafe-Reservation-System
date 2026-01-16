require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");

const connectDB = require("./src/config/db");

const tableRoutes = require("./src/routes/table.routes");
const menuRoutes = require("./src/routes/menu.routes");
const reservationRoutes = require("./src/routes/reservation.routes");
const availabilityRoutes = require("./src/routes/availability.routes");

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
const SERVICE_NAME = process.env.SERVICE_NAME || "RESERVATION-SERVICE";
const PORT = process.env.PORT || 4002;

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
   PUBLIC MENU ROUTE
   (NO AUTH – unchanged logic)
========================= */
app.get("/api/menus", async (req, res) => {
  try {
    const Menu = require("./src/models/menu.model");
    const menus = await Menu.find({ isAvailable: true }).sort({
      displayOrder: 1,
    });
    res.json(menus);
  } catch (err) {
    console.error("🔥 Fetch menus failed:", err.message);
    res.status(500).json({ message: "Failed to fetch menus" });
  }
});

/* =========================
   ROUTES (UNCHANGED)
========================= */
app.use("/api/tables", tableRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/availability", availabilityRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (_, res) => {
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
  console.error("🔥 RESERVATION SERVICE ERROR:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

/* =========================
   SERVER (KEEP-ALIVE FIX)
========================= */
const server = http.createServer(app);

server.keepAliveTimeout = 65000; // critical for Render cold starts
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
