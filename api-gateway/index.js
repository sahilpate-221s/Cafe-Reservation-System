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
   BASIC MIDDLEWARE
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
  console.error("❌ CRITICAL: Service URLs missing");
}

/* =========================
   REQUEST LOGGER
========================= */
app.use((req, _, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

/* =========================
   AXIOS INSTANCE
========================= */
const http = axios.create({
  timeout: 15000,
});

/* =========================
   SAFE REQUEST (RETRY ONLY ON NETWORK)
========================= */
async function safeRequest(config, retries = 1) {
  try {
    return await http(config);
  } catch (err) {
    if (!err.response && retries > 0) {
      console.warn("🔁 Network error, retrying (cold start)");
      await new Promise((r) => setTimeout(r, 4000));
      return safeRequest(config, retries - 1);
    }
    throw err;
  }
}

/* =========================
   SERVICE WARM-UP
========================= */
async function warmUpServices() {
  console.log("🔥 WARMING UP SERVICES");

  try {
    await http.get(`${AUTH_SERVICE}/health`);
    console.log("✅ Auth warmed");
  } catch {}

  try {
    await http.get(`${RES_SERVICE}/health`);
    console.log("✅ Reservation warmed");
  } catch {}
}

setTimeout(warmUpServices, 3000);
/* =========================
   WAKE-UP ENDPOINT (PUBLIC)
   🔥 CRITICAL FOR RENDER
========================= */

app.get("/api/wakeup", async (_, res) => {
  // fire-and-forget (do NOT await)
  axios.get(`${AUTH_SERVICE}/health`).catch(() => {});
  axios.get(`${RES_SERVICE}/health`).catch(() => {});

  res.json({
    status: "Waking up backend services",
  });
});

/* =========================
   AUTH (PUBLIC)
========================= */
app.use("/api/auth", async (req, res) => {
  try {
    const response = await safeRequest({
      method: req.method,
      url: `${AUTH_SERVICE}${req.originalUrl}`,
      data: req.body,
      headers: {
        authorization: req.headers.authorization,
        "content-type": req.headers["content-type"],
        "x-internal-call": "true",
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 502)
      .json(err.response?.data || { message: "Auth service unavailable" });
  }
});

/* =========================
   PUBLIC MENU (ONLY HERE)
========================= */
app.get("/api/menus", async (_, res) => {
  try {
    const response = await safeRequest({
      method: "GET",
      url: `${RES_SERVICE}/api/menus`,
    });

    res.json(response.data);
  } catch {
    res.status(502).json({ message: "Menu service unavailable" });
  }
});

/* =========================
   PUBLIC AVAILABILITY (ONLY HERE)
========================= */
app.get("/api/availability", async (req, res) => {
  try {
    const response = await safeRequest({
      method: "GET",
      url: `${RES_SERVICE}/api/availability`,
      params: req.query,
    });

    res.json(response.data);
  } catch {
    res.status(502).json({ message: "Availability service unavailable" });
  }
});

/* =========================
   BOOKING
========================= */
app.post(
  "/api/reservations/book",
  verifyJWT,
  bookingRateLimiter,
  async (req, res) => {
    try {
      const response = await safeRequest({
        method: "POST",
        url: `${RES_SERVICE}/api/reservations/book`,
        data: req.body,
        headers: {
          "x-user-id": req.headers["x-user-id"],
          "x-user-role": req.headers["x-user-role"],
        },
      });

      res.status(response.status).json(response.data);
    } catch (err) {
      res
        .status(err.response?.status || 502)
        .json(err.response?.data || { message: "Booking failed" });
    }
  }
);

/* =========================
   LOCK / UNLOCK
========================= */
app.post(
  ["/api/reservations/lock", "/api/reservations/unlock"],
  verifyJWT,
  allowRoles(["USER", "ADMIN"]),
  async (req, res) => {
    try {
      const response = await safeRequest({
        method: "POST",
        url: `${RES_SERVICE}${req.originalUrl}`,
        data: req.body,
        headers: {
          "x-user-id": req.headers["x-user-id"],
          "x-user-role": req.headers["x-user-role"],
        },
      });

      res.status(response.status).json(response.data);
    } catch {
      res.status(502).json({ message: "Reservation service unavailable" });
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
      const response = await safeRequest({
        method: req.method,
        url: `${RES_SERVICE}${req.originalUrl}`,
        data: req.body,
        headers: {
          "x-user-id": req.headers["x-user-id"],
          "x-user-role": req.headers["x-user-role"],
        },
      });

      res.status(response.status).json(response.data);
    } catch {
      res.status(502).json({ message: "Admin service unavailable" });
    }
  }
);

/* =========================
   USER + ADMIN (LAST)
========================= */
app.use("/api", verifyJWT, allowRoles(["USER", "ADMIN"]), async (req, res) => {
  try {
    const response = await safeRequest({
      method: req.method,
      url: `${RES_SERVICE}${req.originalUrl}`,
      data: req.body,
      headers: {
        "x-user-id": req.headers["x-user-id"],
        "x-user-role": req.headers["x-user-role"],
      },
    });

    res.status(response.status).json(response.data);
  } catch {
    res.status(502).json({ message: "Service unavailable" });
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
process.on("unhandledRejection", (r) =>
  console.error("🔥 UNHANDLED REJECTION:", r)
);
process.on("uncaughtException", (e) =>
  console.error("🔥 UNCAUGHT EXCEPTION:", e)
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`[API-GATEWAY] running on port ${PORT}`)
);
