require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");

const { verifyJWT } = require("./middleware/auth");
const { allowRoles } = require("./middleware/rbac");
const { bookingRateLimiter } = require("./middleware/rateLimiter");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* =========================
   ENV CONFIG
========================= */
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL;
const RES_SERVICE = process.env.RESERVATION_SERVICE_URL;

console.log("🔧 CONFIG CHECK:");
console.log("AUTH_SERVICE_URL:", AUTH_SERVICE || "❌ NOT SET");
console.log("RESERVATION_SERVICE_URL:", RES_SERVICE || "❌ NOT SET");

if (!AUTH_SERVICE || !RES_SERVICE) {
  console.error("❌ CRITICAL: One or more service URLs missing");
}

/* =========================
   GLOBAL REQUEST LOGGER
========================= */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(
    `🕒 [${req.requestTime}] ${req.method} ${req.originalUrl}`
  );
  next();
});

/* =========================
   AUTH ROUTES (PUBLIC)
========================= */
app.use("/api/auth", async (req, res) => {
  const targetUrl = `${AUTH_SERVICE}${req.originalUrl}`;

  console.log("🟡 AUTH PROXY START");
  console.log("➡️ Incoming:", req.method, req.originalUrl);
  console.log("🔗 Forwarding to:", targetUrl);
  console.log("📦 Body:", req.body);

  try {
    const start = Date.now();

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
      timeout: 10000,
    });

    console.log(
      `✅ AUTH RESPONSE (${Date.now() - start}ms):`,
      response.status
    );

    res.status(response.status).json(response.data);

  } catch (err) {
    console.error("🔴 AUTH PROXY FAILED");
    console.error("⏱ Time:", req.requestTime);
    console.error("📍 Target URL:", targetUrl);

    if (err.code) {
      console.error("Axios Error Code:", err.code);
    }

    if (err.response) {
      console.error("📥 Response Status:", err.response.status);
      console.error("📥 Response Data:", err.response.data);
    } else if (err.request) {
      console.error("📡 No response received from Auth Service");
      console.error("🚨 POSSIBLE CAUSES:");
      console.error("- Render free-tier sleep (cold start)");
      console.error("- Auth service crashed");
      console.error("- Wrong AUTH_SERVICE_URL");
    } else {
      console.error("❌ Axios config error:", err.message);
    }

    res
      .status(err.response?.status || 502)
      .json({ message: "Auth service unavailable" });
  }
});

/* =========================
   PUBLIC MENU ROUTE
========================= */
app.get("/api/menus", async (req, res) => {
  console.log("🟡 MENU REQUEST →", `${RES_SERVICE}/api/menus`);

  try {
    const response = await axios.get(`${RES_SERVICE}/api/menus`);
    console.log("✅ MENU RESPONSE:", response.status);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("🔴 MENU FAILED");

    if (err.response) {
      console.error("Status:", err.response.status);
    } else {
      console.error("No response from Reservation Service");
    }

    res
      .status(err.response?.status || 500)
      .json({ message: "Menu request failed" });
  }
});

/* =========================
   BOOKING ROUTE
========================= */
app.use(
  "/api/reservations/book",
  verifyJWT,
  bookingRateLimiter,
  async (req, res) => {
    console.log("🟡 BOOKING REQUEST");

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

      console.log("✅ BOOKING RESPONSE:", response.status);
      res.status(response.status).json(response.data);
    } catch (err) {
      console.error("🔴 BOOKING FAILED");

      res
        .status(err.response?.status || 500)
        .json({ message: "Booking failed" });
    }
  }
);

/* =========================
   LOCK / UNLOCK
========================= */
app.use(
  ["/api/reservations/lock", "/api/reservations/unlock"],
  verifyJWT,
  allowRoles(["USER", "ADMIN"]),
  async (req, res) => {
    console.log("🟡 LOCK/UNLOCK REQUEST");

    try {
      const endpoint = req.originalUrl.includes("/lock") ? "/lock" : "/unlock";

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

      console.log("✅ LOCK/UNLOCK RESPONSE:", response.status);
      res.status(response.status).json(response.data);
    } catch (err) {
      console.error("🔴 LOCK/UNLOCK FAILED");

      res
        .status(err.response?.status || 500)
        .json({ message: "Lock operation failed" });
    }
  }
);

/* =========================
   ADMIN ROUTES
========================= */
const adminRoutes = ["/api/tables", "/api/menus", "/api/reservations/all"];

adminRoutes.forEach((path) => {
  app.use(path, verifyJWT, allowRoles(["ADMIN"]), async (req, res) => {
    console.log("🟡 ADMIN REQUEST:", req.originalUrl);

    try {
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

      console.log("✅ ADMIN RESPONSE:", response.status);
      res.status(response.status).json(response.data);
    } catch (err) {
      console.error("🔴 ADMIN FAILED");

      res
        .status(err.response?.status || 500)
        .json({ message: "Admin request failed" });
    }
  });
});

/* =========================
   USER + ADMIN (LAST)
========================= */
app.use("/api", verifyJWT, allowRoles(["USER", "ADMIN"]), async (req, res) => {
  console.log("🟡 USER REQUEST:", req.originalUrl);

  try {
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

    console.log("✅ USER RESPONSE:", response.status);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("🔴 USER REQUEST FAILED");

    res
      .status(err.response?.status || 500)
      .json({ message: "Request failed" });
  }
});

/* =========================
   HEALTH
========================= */
app.get("/health", (_, res) => {
  res.json({ service: "API-GATEWAY", status: "OK" });
});

/* =========================
   CRASH SAFETY
========================= */
process.on("unhandledRejection", (reason) => {
  console.error("🔥 UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION:", err);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`[API-GATEWAY] running on port ${PORT}`)
);
