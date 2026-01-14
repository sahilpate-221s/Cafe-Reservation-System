const Table = require("../models/table.model");
const Reservation = require("../models/reservation.model");
const redis = require("../config/redis");
const { log, error } = require("../utils/logger");

/**
 * GET AVAILABLE TABLES
 * Query params: date, timeSlot
 */
exports.getAvailability = async (req, res) => {
  const { date, timeSlot, guests } = req.query;

  if (!date || !timeSlot) {
    return res.status(400).json({
      message: "date and timeSlot are required",
    });
  }

  try {
    // 1️⃣ Fetch all tables
    const tables = await Table.find();

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

    // 4️⃣ Filter available tables (not reserved and not locked)
    let availableTables = tables.filter(
      (table) =>
        !reservedTableIds.includes(table._id.toString()) &&
        !lockedTableIds.includes(table._id.toString())
    );

    // 5️⃣ Filter by capacity if guests parameter is provided
    if (guests) {
      const guestCount = parseInt(guests, 10);
      if (!isNaN(guestCount) && guestCount > 0) {
        availableTables = availableTables.filter(
          (table) => table.capacity >= guestCount
        );
      }
    }

    // Add id field for frontend compatibility
    const formattedTables = availableTables.map(table => ({
      ...table.toObject(),
      id: table._id.toString()
    }));

    log(
      `Availability check for ${date} ${timeSlot}: ${formattedTables.length} tables free`
    );

    res.json(formattedTables);
  } catch (err) {
    error("Availability check failed", err);
    res.status(500).json({ message: "Failed to check availability" });
  }
};
