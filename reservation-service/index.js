require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/db");

const tableRoutes = require("./src/routes/table.routes");
const menuRoutes = require("./src/routes/menu.routes");
const reservationRoutes = require("./src/routes/reservation.routes");
const availabilityRoutes = require("./src/routes/availability.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDB();

// Public menu route (no auth required)
app.get("/api/menus", async (req, res) => {
  try {
    const Menu = require("./src/models/menu.model");
    const menus = await Menu.find({ isAvailable: true }).sort({ displayOrder: 1 });
    res.json(menus);
  } catch (err) {
    console.error("Fetch menus failed", err);
    res.status(500).json({ message: "Failed to fetch menus" });
  }
});

app.use("/api/tables", tableRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/availability", availabilityRoutes);

app.get("/health", (_, res) =>
  res.json({ service: "reservation-service", status: "OK" })
);

const PORT = process.env.PORT || 4002;

app.listen(PORT, () =>
  console.log(`[RESERVATION-SERVICE] running on port ${PORT}`)
);
