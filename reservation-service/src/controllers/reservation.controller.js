const Reservation = require("../models/reservation.model");
const Table = require("../models/table.model");
const { getUserContext } = require("../middleware/auth.context");
const redis = require("../config/redis");
const axios = require("axios");
const { log, error } = require("../utils/logger");

/* =========================
   INTERNAL HELPERS
========================= */

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:4001";

const INTERNAL_AUTH_HEADER = {
  Authorization: `Bearer ${
    process.env.INTERNAL_API_TOKEN || "internal-token"
  }`,
};

// Fetch user details (non-blocking fallback)
const fetchUserDetails = async (userId) => {
  try {
    const res = await axios.get(
      `${AUTH_SERVICE_URL}/api/auth/user/${userId}`,
      { headers: INTERNAL_AUTH_HEADER }
    );
    return res.data;
  } catch (err) {
    error(`Failed to fetch user details for ${userId}`, err);
    return { name: "Unknown User", email: "unknown@example.com" };
  }
};

// Common auth guard
const requireUser = (req, res) => {
  const { userId, role } = getUserContext(req);
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }
  return { userId, role };
};

/* =========================
   BOOK TABLE
========================= */
exports.bookTable = async (req, res) => {
  const auth = requireUser(req, res);
  if (!auth) return;

  const { userId } = auth;
  const { tableId, date, timeSlot, guests } = req.body;

  if (!tableId || !date || !timeSlot || !guests) {
    return res.status(400).json({
      message: "tableId, date, timeSlot, and guests are required",
    });
  }

  const lockKey = `lock:${tableId}:${date}:${timeSlot}`;
  let reservationCreated = false;

  try {
    // 1️⃣ Validate table
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (guests > table.capacity) {
      return res.status(400).json({
        message: `Table capacity (${table.capacity}) is less than requested guests (${guests})`,
      });
    }

    // 2️⃣ Ensure no confirmed reservation exists
    const alreadyBooked = await Reservation.exists({
      tableId,
      date,
      timeSlot,
      status: "CONFIRMED",
    });

    if (alreadyBooked) {
      return res
        .status(409)
        .json({ message: "Table already reserved for this time slot" });
    }

    // 3️⃣ Validate lock ownership
    const lockOwner = await redis.get(lockKey);
    if (lockOwner !== userId) {
      return res.status(403).json({
        message: lockOwner
          ? "Table is being selected by another user. Please select a different table."
          : "Lock expired. Please select the table again.",
      });
    }

    // 4️⃣ Extend lock TTL
    await redis.expire(lockKey, 300);

    // 5️⃣ Create reservation
    const reservation = await Reservation.create({
      tableId,
      userId,
      date,
      timeSlot,
      guests,
      status: "CONFIRMED",
    });

    reservationCreated = true;

    // 6️⃣ Release lock
    await redis.del(lockKey);

    log(
      `Reservation created | user=${userId} table=${tableId} ${date} ${timeSlot}`
    );

    res
      .status(201)
      .json({ message: "Reservation created successfully", reservation });
  } catch (err) {
    // Cleanup lock only if booking failed
    if (!reservationCreated) {
      const owner = await redis.get(lockKey);
      if (owner === userId) {
        await redis.del(lockKey).catch(() => {});
      }
    }

    if (err.code === 11000) {
      return res.status(409).json({
        message:
          "Table already reserved for this time slot. Another user may have just booked it.",
      });
    }

    error("Reservation creation failed", err);
    res.status(500).json({ message: "Failed to create reservation" });
  }
};

/* =========================
   CANCEL RESERVATION
========================= */
exports.cancelReservation = async (req, res) => {
  const auth = requireUser(req, res);
  if (!auth) return;

  const { userId } = auth;
  const { id } = req.params;

  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: id, userId },
      { status: "CANCELLED" },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    log(`Reservation cancelled | id=${id} user=${userId}`);
    res.json({ message: "Reservation cancelled successfully", reservation });
  } catch (err) {
    error("Reservation cancellation failed", err);
    res.status(500).json({ message: "Failed to cancel reservation" });
  }
};

/* =========================
   GET MY RESERVATIONS
========================= */
exports.getMyReservations = async (req, res) => {
  const auth = requireUser(req, res);
  if (!auth) return;

  const { userId } = auth;

  try {
    const [reservations, userDetails] = await Promise.all([
      Reservation.find({ userId }).populate("tableId"),
      fetchUserDetails(userId),
    ]);

    const result = reservations.map((r) => ({
      ...r.toObject(),
      userName: userDetails.name,
      userId: undefined,
    }));

    res.json(result);
  } catch (err) {
    error("Failed to fetch reservations", err);
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
};

/* =========================
   GET ALL RESERVATIONS (ADMIN)
========================= */
exports.getAllReservations = async (req, res) => {
  const auth = requireUser(req, res);
  if (!auth || auth.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const reservations = await Reservation.find().populate("tableId");

    const userIds = [
      ...new Set(reservations.map((r) => r.userId.toString())),
    ];

    const users = await Promise.all(
      userIds.map((id) => fetchUserDetails(id))
    );

    const userMap = {};
    userIds.forEach((id, i) => (userMap[id] = users[i]));

    const result = reservations.map((r) => ({
      ...r.toObject(),
      userName: userMap[r.userId.toString()]?.name || "Unknown User",
      userId: undefined,
    }));

    res.json(result);
  } catch (err) {
    error("Failed to fetch all reservations", err);
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
};

/* =========================
   ACQUIRE LOCK
========================= */
exports.acquireLock = async (req, res) => {
  const auth = requireUser(req, res);
  if (!auth) return;

  const { userId } = auth;
  const { tableId, date, timeSlot } = req.body;

  if (!tableId || !date || !timeSlot) {
    return res
      .status(400)
      .json({ message: "tableId, date, and timeSlot are required" });
  }

  const lockKey = `lock:${tableId}:${date}:${timeSlot}`;

  try {
    const alreadyBooked = await Reservation.exists({
      tableId,
      date,
      timeSlot,
      status: "CONFIRMED",
    });

    if (alreadyBooked) {
      return res
        .status(409)
        .json({ message: "Table is already reserved for this time slot" });
    }

    const lock = await redis.set(lockKey, userId, "NX", "EX", 300);

    if (!lock) {
      const owner = await redis.get(lockKey);
      return res.status(409).json({
        message:
          owner === userId
            ? "You already have a lock on this table"
            : "Table is being selected by another user",
      });
    }

    log(`Lock acquired ${lockKey} by user ${userId}`);
    res.json({ message: "Lock acquired successfully" });
  } catch (err) {
    error("Lock acquisition failed", err);
    res.status(500).json({ message: "Failed to acquire lock" });
  }
};

/* =========================
   RELEASE LOCK
========================= */
exports.releaseLock = async (req, res) => {
  const auth = requireUser(req, res);
  if (!auth) return;

  const { userId } = auth;
  const { tableId, date, timeSlot } = req.body;

  if (!tableId || !date || !timeSlot) {
    return res
      .status(400)
      .json({ message: "tableId, date, and timeSlot are required" });
  }

  const lockKey = `lock:${tableId}:${date}:${timeSlot}`;

  try {
    const result = await redis.eval(
      `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `,
      1,
      lockKey,
      userId
    );

    if (!result) {
      return res
        .status(403)
        .json({ message: "Not authorized to release this lock" });
    }

    log(`Lock released ${lockKey} by user ${userId}`);
    res.json({ message: "Lock released successfully" });
  } catch (err) {
    error("Lock release failed", err);
    res.status(500).json({ message: "Failed to release lock" });
  }
};
