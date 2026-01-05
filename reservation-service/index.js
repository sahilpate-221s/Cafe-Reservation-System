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

app.use("/api/tables", tableRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/availability", availabilityRoutes);

app.get("/health", (_, res) =>
  res.json({ service: "reservation-service", status: "OK" })
);

app.listen(4002, () =>
  console.log("[RESERVATION-SERVICE] running on port 4002")
);
