const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
  keyPrefix: "cafe:",
});

redis.on("connect", () => {
  console.log("[RESERVATION-SERVICE] Redis connected");
});

redis.on("error", (err) => {
  console.error("[RESERVATION-SERVICE] Redis error:", err);
});

module.exports = redis;
