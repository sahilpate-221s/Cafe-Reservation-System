const Redis = require("ioredis");

const redis = new Redis("redis://127.0.0.1:6379");

(async () => {
  try {
    console.log("Setting key...");
    const result1 = await redis.set("test-lock", "user1", "NX", "EX", 10);
    console.log("First SET result:", result1);

    console.log("Trying second set...");
    const result2 = await redis.set("test-lock", "user2", "NX", "EX", 10);
    console.log("Second SET result:", result2);

    await redis.del("test-lock");
    console.log("Key deleted");

    process.exit(0);
  } catch (err) {
    console.error("Redis test failed:", err);
    process.exit(1);
  }
})();
