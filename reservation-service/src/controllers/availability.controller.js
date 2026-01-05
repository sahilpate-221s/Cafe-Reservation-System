const Table = require("../models/table.model");
const Reservation = require("../models/reservation.model");
const redis = require("../config/redis");
const { log, error } = require("../utils/logger");

/**
 * GET AVAILABLE TABLES
 * Query params: date, timeSlot
 */
exports.getAvailability = async (req, res) => {
  const { date, timeSlot } = req.query;

  if (!date || !timeSlot) {
    return res.status(400).json({
      message: "date and timeSlot are required",
    });
  }

  try {
    // 1️⃣ Fetch all tables
    const tables = await Table.find();
    log(`Fetched ${tables.length} tables`);

    // 2️⃣ Fetch confirmed reservations for slot
    const reservations = await Reservation.find({
      date,
      timeSlot,
      status: "CONFIRMED",
    }).select("tableId");

    const reservedTableIds = reservations.map((r) =>
      r.tableId.toString()
    );

    // 3️⃣ Check Redis locks
    const lockedTableIds = [];

    for (const table of tables) {
      const lockKey = `lock:${table._id}:${date}:${timeSlot}`;
      const isLocked = await redis.exists(lockKey);
      if (isLocked) {
        lockedTableIds.push(table._id.toString());
      }
    }

    // 4️⃣ Filter available tables
    const availableTables = tables.filter(
      (table) =>
        !reservedTableIds.includes(table._id.toString()) &&
        !lockedTableIds.includes(table._id.toString())
    );

    log(
      `Availability check for ${date} ${timeSlot}: ${availableTables.length} tables free`
    );

    res.json({
      date,
      timeSlot,
      availableTables,
    });
  } catch (err) {
    error("Availability check failed", err);
    res.status(500).json({ message: "Failed to check availability" });
  }
};
