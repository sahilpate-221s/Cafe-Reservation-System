const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
  keyPrefix: "cafe:",
});

redis.on("connect", () => {
  console.log("[GATEWAY] Redis connected");
});

redis.on("error", (err) => {
  console.error("[GATEWAY] Redis error:", err);
});

module.exports = redis;
