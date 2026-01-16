const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
      trim: true,
    },

    timeSlot: {
      type: String, // e.g. "18:00-20:00"
      required: true,
      trim: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* =========================
   INDEXES (CRITICAL)
========================= */

// Prevent double booking for same table + date + slot
reservationSchema.index(
  { tableId: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

// Optimize common queries:
// - User's bookings
// - Upcoming reservations
reservationSchema.index({ userId: 1, date: 1 });
reservationSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model("Reservation", reservationSchema);
