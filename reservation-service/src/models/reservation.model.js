const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    timeSlot: {
      type: String, // e.g. "18:00-20:00"
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// 🔒 FINAL SAFETY NET
reservationSchema.index(
  { tableId: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
