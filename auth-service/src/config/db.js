const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
     console.log(`[AUTH-SERVICE] MongoDB connected`);
  } catch (error) {
     console.error("[AUTH-SERVICE] MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
