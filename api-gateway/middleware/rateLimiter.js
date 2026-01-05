const redis = require("../config/redis");

exports.loginRateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rate:login:${ip}`;

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 60); // 1 minute window
    }

    if (count > 5) {
      return res.status(429).json({
        message: "Too many login attempts. Try again later.",
      });
    }

    next();
  } catch (err) {
    console.error("[RATE][LOGIN]", err.message);
    next(); // fail-open (important)
  }
};



exports.bookingRateLimiter = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const key = `rate:booking:${userId}`;

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 60); // 1 minute window
    }

    if (count > 3) {
      return res.status(429).json({
        message: "Too many booking attempts. Try again later.",
      });
    }

    next();
  } catch (err) {
    console.error("[RATE][BOOKING]", err.message);
    next(); // fail-open
  }
};
