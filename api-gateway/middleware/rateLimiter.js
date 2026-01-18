const redis = require("../config/redis");

/**
 * LOGIN RATE LIMITER
 * - Limits login attempts per IP
 * - Window: 60 seconds
 * - Max attempts: 5
 * - Fail-open on Redis failure
 */
// exports.loginRateLimiter = async (req, res, next) => {
//   const ip = req.ip;
//   const key = `rate:login:${ip}`;

//   try {
//     const count = await redis.incr(key);

//     // First request → set TTL
//     if (count === 1) {
//       await redis.expire(key, 60);
//     }

//     if (count > 5) {
//       console.warn("🚦 LOGIN RATE LIMIT HIT:", { ip, count });
//       return res.status(429).json({
//         message: "Too many login attempts. Try again later.",
//       });
//     }

//     console.log("✅ LOGIN RATE OK:", { ip, count });
//     next();
//   } catch (err) {
//     // Fail-open strategy (critical for availability)
//     console.error("🔥 REDIS LOGIN RATE LIMIT ERROR:", err.message);
//     console.warn("⚠️  Rate limiter bypassed (fail-open)");
//     next();
//   }
// };

exports.loginRateLimiter = async (req, res, next) => {
  // ✅ SKIP internal service calls
  if (req.headers["x-internal-call"] === "true") {
    return next();
  }

  const ip = req.ip;
  const key = `rate:login:${ip}`;

  try {
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 60);
    }

    if (count > 5) {
      return res.status(429).json({
        message: "Too many login attempts. Try again later.",
      });
    }

    next();
  } catch (err) {
    next(); // fail-open
  }
};

/**
 * BOOKING RATE LIMITER
 * - Limits booking attempts per user
 * - Window: 60 seconds
 * - Max attempts: 3
 * - Requires authenticated user
 * - Fail-open on Redis failure
 */
exports.bookingRateLimiter = async (req, res, next) => {
  const userId = req.headers["x-user-id"];
  const key = `rate:booking:${userId}`;

  try {
    // User must be authenticated
    if (!userId) {
      console.error("🚫 BOOKING RATE LIMIT ERROR: Missing user ID");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const count = await redis.incr(key);

    // First request → set TTL
    if (count === 1) {
      await redis.expire(key, 60);
    }

    if (count > 3) {
      console.warn("🚦 BOOKING RATE LIMIT HIT:", { userId, count });
      return res.status(429).json({
        message: "Too many booking attempts. Try again later.",
      });
    }

    console.log("✅ BOOKING RATE OK:", { userId, count });
    next();
  } catch (err) {
    // Fail-open strategy
    console.error("🔥 REDIS BOOKING RATE LIMIT ERROR:", err.message);
    console.warn("⚠️  Booking rate limiter bypassed (fail-open)");
    next();
  }
};
