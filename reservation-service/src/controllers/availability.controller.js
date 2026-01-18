const Table = require("../models/table.model");
const Reservation = require("../models/reservation.model");
const redis = require("../config/redis");
const { log, error } = require("../utils/logger");

/**
 * GET AVAILABLE TABLES
 * Query params: date, timeSlot, guests (optional)
 */
exports.getAvailability = async (req, res) => {
  const { date, timeSlot, guests } = req.query;

  if (!date || !timeSlot) {
    return res.status(400).json({
      message: "date and timeSlot are required",
    });
  }

  const guestCount = guests ? parseInt(guests, 10) : null;

  try {
    /* =========================
       1️⃣ FETCH TABLES (OPTIMIZED)
    ========================= */
    const tableQuery = {};
    if (guestCount && !isNaN(guestCount) && guestCount > 0) {
      tableQuery.capacity = { $gte: guestCount };
    }

    const tables = await Table.find(tableQuery)
      .select("_id name capacity image location view")
      .lean();

    if (tables.length === 0) {
      return res.json([]);
    }

    const tableIds = tables.map((t) => t._id);

    /* =========================
       2️⃣ FETCH CONFIRMED RESERVATIONS
    ========================= */
    const reservations = await Reservation.find({
      tableId: { $in: tableIds },
      date,
      timeSlot,
      status: "CONFIRMED",
    }).select("tableId");

    const reservedSet = new Set(
      reservations.map((r) => r.tableId.toString())
    );

    /* =========================
       3️⃣ CHECK REDIS LOCKS (BATCHED)
    ========================= */
    const lockKeys = tableIds.map(
      (id) => `lock:${id}:${date}:${timeSlot}`
    );

    const lockResults = await redis.mget(lockKeys);

    const lockedSet = new Set();
    lockResults.forEach((value, index) => {
      if (value) {
        lockedSet.add(tableIds[index].toString());
      }
    });

    /* =========================
       4️⃣ FILTER AVAILABLE TABLES
    ========================= */
    const availableTables = tables.filter(
      (table) =>
        !reservedSet.has(table._id.toString()) &&
        !lockedSet.has(table._id.toString())
    );

    /* =========================
       5️⃣ FORMAT RESPONSE
    ========================= */
    const formattedTables = availableTables.map((table) => ({
      ...table,
      id: table._id.toString(),
    }));

    log(
      `Availability ${date} ${timeSlot}: ${formattedTables.length} tables available`
    );

    res.json(formattedTables);
  } catch (err) {
    error("Availability check failed", err);
    res.status(500).json({ message: "Failed to check availability" });
  }
};
