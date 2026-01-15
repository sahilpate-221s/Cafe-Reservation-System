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
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization,
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { message: "Auth service error" });
  }
});

/* =========================
   PUBLIC MENU ROUTE
   MUST COME BEFORE /api
========================= */
app.get("/api/menus", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${RES_SERVICE}/api/menus`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Menu request failed" });
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
   LOCK/UNLOCK ROUTES
   MUST COME BEFORE /api
========================= */
app.use(
  ["/api/reservations/lock", "/api/reservations/unlock"],
  verifyJWT,
  allowRoles(["USER", "ADMIN"]),
  async (req, res) => {
    try {
      const endpoint = req.originalUrl.includes('/lock') ? '/lock' : '/unlock';
      const response = await axios({
        method: req.method,
        url: `${RES_SERVICE}/api/reservations${endpoint}`,
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
        .json(err.response?.data || { message: "Lock operation failed" });
    }
  }
);

/* =========================
   ADMIN ROUTES
========================= */
const adminRoutes = ["/api/tables", "/api/menus", "/api/reservations/all"];

adminRoutes.forEach((path) => {
  app.use(
    path,
    verifyJWT,
    allowRoles(["ADMIN"]),
    async (req, res) => {
      try {
        // Use req.originalUrl to preserve the full path including /api prefix
        const response = await axios({
          method: req.method,
          url: `${RES_SERVICE}${req.originalUrl}`,
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
});

/* =========================
   USER + ADMIN (LAST)
========================= */
app.use(
  "/api",
  verifyJWT,
  allowRoles(["USER", "ADMIN"]),
  async (req, res) => {
    try {
      // Use req.originalUrl to preserve the full path including /api prefix
      const response = await axios({
        method: req.method,
        url: `${RES_SERVICE}${req.originalUrl}`,
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`[API-GATEWAY] running on port ${PORT}`)
);

