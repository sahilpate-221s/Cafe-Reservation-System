// const Redis = require("ioredis");

// const redis = new Redis(process.env.REDIS_URL, {
//   keyPrefix: "cafe:",
// });

// redis.on("connect", () => {
//   console.log("[GATEWAY] Redis connected");
// });

// redis.on("error", (err) => {
//   console.error("[GATEWAY] Redis error:", err);
// });

// module.exports = redis;



const Redis = require("ioredis");

if (!process.env.REDIS_URL) {
  console.warn("⚠️ REDIS_URL not set. Rate limiting may be disabled.");
}

const redis = new Redis(process.env.REDIS_URL, {
  keyPrefix: "cafe:",
  maxRetriesPerRequest: null, // prevent command rejection on reconnect
  enableReadyCheck: true,
});

/* =========================
   REDIS EVENTS
========================= */
redis.on("connect", () => {
  console.log("🔗 Redis connected");
});

redis.on("ready", () => {
  console.log("✅ Redis ready to accept commands");
});

redis.on("reconnecting", () => {
  console.warn("🔁 Redis reconnecting...");
});

redis.on("error", (err) => {
  console.error("🔥 Redis error:", err.message);
});

redis.on("end", () => {
  console.warn("⚠️ Redis connection closed");
});

module.exports = redis;
