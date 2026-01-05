const Reservation = require("../models/reservation.model");
const redis = require("../config/redis");
const { getUserContext } = require("../middleware/auth.context");
const { log, error } = require("../utils/logger");

/**
 * BOOK TABLE
 */
exports.bookTable = async (req, res) => {
  const { tableId, date, timeSlot } = req.body;
  const { userId } = getUserContext(req);

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const lockKey = `lock:${tableId}:${date}:${timeSlot}`;

  try {
    const lock = await redis.set(lockKey, userId, "NX", "EX", 60);
    if (!lock)
      return res.status(409).json({ message: "Table already locked" });

    log(`Lock acquired ${lockKey}`);

    const reservation = await Reservation.create({
      tableId,
      userId,
      date,
      timeSlot,
      status: "CONFIRMED",
    });

    return res.status(201).json(reservation);
  } catch (err) {
    error("Booking failed", err);
    if (err.code === 11000)
      return res.status(409).json({ message: "Already booked" });

    res.status(500).json({ message: "Booking error" });
  } finally {
    await redis.del(lockKey);
    log(`Lock released ${lockKey}`);
  }
};

/**
 * CANCEL RESERVATION
 */
exports.cancelReservation = async (req, res) => {
  const { userId, role } = getUserContext(req);
  const { id } = req.params;

  const reservation = await Reservation.findById(id);
  if (!reservation)
    return res.status(404).json({ message: "Not found" });

  if (reservation.userId !== userId && role !== "ADMIN")
    return res.status(403).json({ message: "Forbidden" });

  reservation.status = "CANCELLED";
  await reservation.save();

  log(`Reservation cancelled ${id}`);
  res.json({ message: "Cancelled successfully" });
};

/**
 * GET USER RESERVATIONS
 */
exports.getMyReservations = async (req, res) => {
  const { userId } = getUserContext(req);
  const reservations = await Reservation.find({ userId });
  res.json(reservations);
};

/**
 * ADMIN: GET ALL RESERVATIONS
 */
exports.getAllReservations = async (req, res) => {
  const { role } = getUserContext(req);
  if (role !== "ADMIN")
    return res.status(403).json({ message: "Admin only" });

  const reservations = await Reservation.find();
  res.json(reservations);
};
