require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");

const { verifyJWT } = require("./middleware/auth");
const { allowRoles } = require("./middleware/rbac");
const {
  loginRateLimiter,
  bookingRateLimiter,
} = require("./middleware/rateLimiter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL;
const RES_SERVICE = process.env.RESERVATION_SERVICE_URL;

/* =========================
   DEBUG (keep for now)
========================= */
app.use((req, _, next) => {
  console.log("➡️ Incoming:", req.method, req.originalUrl);
  next();
});

/* =========================
   AUTH ROUTES (PUBLIC)
========================= */
app.use("/api/auth/login", loginRateLimiter);

app.use("/api/auth", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${AUTH_SERVICE}/api/auth${req.url}`,
      data: req.body,
      headers: { "Content-Type": "application/json" },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { message: "Auth service error" });
  }
});

/* =========================
   BOOKING ROUTE (VERY IMPORTANT)
   MUST COME BEFORE /api
========================= */
app.use(
  "/api/reservations/book",
  verifyJWT,
  bookingRateLimiter,
  async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: `${RES_SERVICE}/api/reservations/book`,
        data: req.body,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": req.headers["x-user-id"],
          "x-user-role": req.headers["x-user-role"],
        },
      });

      res.status(response.status).json(response.data);
    } catch (err) {
      res
        .status(err.response?.status || 500)
        .json(err.response?.data || { message: "Booking failed" });
    }
  }
);

/* =========================
   ADMIN ROUTES
========================= */
app.use(
  ["/api/tables", "/api/menus", "/api/reservations/all"],
  verifyJWT,
  allowRoles(["ADMIN"]),
  async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: `${RES_SERVICE}/api${req.url}`,
        data: req.body,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": req.headers["x-user-id"],
          "x-user-role": req.headers["x-user-role"],
        },
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      res
        .status(err.response?.status || 500)
        .json(err.response?.data || { message: "Admin request failed" });
    }
  }
);

/* =========================
   USER + ADMIN (LAST)
========================= */
app.use(
  "/api",
  verifyJWT,
  allowRoles(["USER", "ADMIN"]),
  async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: `${RES_SERVICE}/api${req.url}`,
        data: req.body,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": req.headers["x-user-id"],
          "x-user-role": req.headers["x-user-role"],
        },
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      res
        .status(err.response?.status || 500)
        .json(err.response?.data || { message: "Request failed" });
    }
  }
);

/* =========================
   HEALTH
========================= */
app.get("/health", (_, res) => {
  res.json({ service: "API-GATEWAY", status: "OK" });
});

app.listen(4000, () =>
  console.log("[API-GATEWAY] running on port 4000")
);
