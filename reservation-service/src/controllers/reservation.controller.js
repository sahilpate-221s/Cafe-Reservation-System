const Reservation = require("../models/reservation.model");
const Table = require("../models/table.model");
const { getUserContext } = require("../middleware/auth.context");
const redis = require("../config/redis");
const axios = require("axios");
const { log, error } = require("../utils/logger");

// Helper function to fetch user details from auth service
const fetchUserDetails = async (userId) => {
  try {
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
    const response = await axios.get(`${authServiceUrl}/api/auth/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.INTERNAL_API_TOKEN || 'internal-token'}`, // Use a token for internal calls
      },
    });
    return response.data;
  } catch (err) {
    error(`Failed to fetch user details for ${userId}`, err);
    return { name: 'Unknown User', email: 'unknown@example.com' }; // Fallback
  }
};

/**
 * BOOK TABLE
 * This function ensures atomic booking with Redis lock validation
 */
exports.bookTable = async (req, res) => {
  const { tableId, date, timeSlot, guests } = req.body;
  const { userId } = getUserContext(req);

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  // Validate required fields
  if (!tableId || !date || !timeSlot || !guests) {
    return res.status(400).json({ message: "tableId, date, timeSlot, and guests are required" });
  }

  const lockKey = `lock:${tableId}:${date}:${timeSlot}`;
  let reservationCreated = false;

  try {
    // 1️⃣ Validate table exists
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    // 2️⃣ Validate table capacity
    if (guests > table.capacity) {
      return res.status(400).json({ 
        message: `Table capacity (${table.capacity}) is less than requested guests (${guests})` 
      });
    }

    // 3️⃣ Check if reservation already exists (double-check before booking)
    const existingReservation = await Reservation.findOne({
      tableId,
      date,
      timeSlot,
      status: "CONFIRMED",
    });

    if (existingReservation) {
      return res.status(409).json({ message: "Table already reserved for this time slot" });
    }

    // 4️⃣ Verify lock ownership (atomic check)
    const lockOwner = await redis.get(lockKey);
    if (lockOwner !== userId) {
      return res.status(403).json({ 
        message: lockOwner 
          ? "Table is being selected by another user. Please select a different table." 
          : "Lock expired. Please select the table again." 
      });
    }

    // 5️⃣ Extend lock expiration to prevent expiration during save
    await redis.expire(lockKey, 300); // Refresh to 5 minutes

    // 6️⃣ Create reservation with CONFIRMED status
    const reservation = new Reservation({
      tableId,
      userId,
      date,
      timeSlot,
      guests,
      status: "CONFIRMED",
    });

    await reservation.save();
    reservationCreated = true; // Mark that we successfully created reservation

    // 7️⃣ Release lock after successful booking
    await redis.del(lockKey);

    log(`Reservation created for user ${userId} on table ${tableId} for ${date} ${timeSlot}`);
    res.status(201).json({ message: "Reservation created successfully", reservation });
  } catch (err) {
    // Release lock if booking failed (we had the lock but booking failed)
    // Only release if we didn't successfully create the reservation
    if (!reservationCreated) {
      const lockOwner = await redis.get(lockKey);
      if (lockOwner === userId) {
        await redis.del(lockKey).catch(e => error("Failed to release lock on error", e));
      }
    }

    if (err.code === 11000) {
      // Unique index violation - double booking prevented
      return res.status(409).json({ 
        message: "Table already reserved for this time slot. Another user may have just booked it." 
      });
    }
    error("Reservation creation failed", err);
    res.status(500).json({ message: "Failed to create reservation" });
  }
};

/**
 * CANCEL RESERVATION
 */
exports.cancelReservation = async (req, res) => {
  const { id } = req.params;
  const { userId } = getUserContext(req);

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: id, userId },
      { status: "CANCELLED" },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    log(`Reservation ${id} cancelled by user ${userId}`);
    res.json({ message: "Reservation cancelled successfully", reservation });
  } catch (err) {
    error("Reservation cancellation failed", err);
    res.status(500).json({ message: "Failed to cancel reservation" });
  }
};

/**
 * GET MY RESERVATIONS
 */
exports.getMyReservations = async (req, res) => {
  const { userId } = getUserContext(req);

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const reservations = await Reservation.find({ userId }).populate("tableId");
    const userDetails = await fetchUserDetails(userId);

    // Replace userId with username in each reservation
    const reservationsWithUsername = reservations.map(reservation => ({
      ...reservation.toObject(),
      userName: userDetails.name,
      userId: undefined, // Remove userId from response
    }));

    res.json(reservationsWithUsername);
  } catch (err) {
    error("Failed to fetch reservations", err);
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
};

/**
 * GET ALL RESERVATIONS (ADMIN)
 */
exports.getAllReservations = async (req, res) => {
  const { role } = getUserContext(req);

  if (role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });

  try {
    const reservations = await Reservation.find().populate("tableId");

    // Get unique userIds
    const userIds = [...new Set(reservations.map(r => r.userId.toString()))];

    // Fetch user details for all unique userIds
    const userDetailsPromises = userIds.map(id => fetchUserDetails(id));
    const userDetailsArray = await Promise.all(userDetailsPromises);

    // Create a map of userId to user details
    const userDetailsMap = {};
    userIds.forEach((id, index) => {
      userDetailsMap[id] = userDetailsArray[index];
    });

    // Replace userId with username in each reservation
    const reservationsWithUsername = reservations.map(reservation => ({
      ...reservation.toObject(),
      userName: userDetailsMap[reservation.userId.toString()]?.name || 'Unknown User',
      userId: undefined, // Remove userId from response
    }));

    res.json(reservationsWithUsername);
  } catch (err) {
    error("Failed to fetch all reservations", err);
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
};

/**
 * ACQUIRE LOCK ON TABLE SELECTION
 * Uses Redis SET with NX (only if not exists) and EX (expiration) for atomic lock acquisition
 */
exports.acquireLock = async (req, res) => {
  const { tableId, date, timeSlot } = req.body;
  const { userId } = getUserContext(req);

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  if (!tableId || !date || !timeSlot) {
    return res.status(400).json({ message: "tableId, date, and timeSlot are required" });
  }

  const lockKey = `lock:${tableId}:${date}:${timeSlot}`;

  try {
    // 1️⃣ Check if table is already reserved
    const existingReservation = await Reservation.findOne({
      tableId,
      date,
      timeSlot,
      status: "CONFIRMED",
    });

    if (existingReservation) {
      return res.status(409).json({ message: "Table is already reserved for this time slot" });
    }

    // 2️⃣ Try to acquire lock atomically (NX = only set if not exists, EX = expire in 300 seconds)
    // This is atomic - only one user can acquire the lock
    const lockResult = await redis.set(lockKey, userId, "NX", "EX", 300);
    
    if (!lockResult) {
      // Lock already exists - check who owns it
      const currentOwner = await redis.get(lockKey);
      return res.status(409).json({ 
        message: currentOwner === userId 
          ? "You already have a lock on this table" 
          : "Table is being selected by another user" 
      });
    }

    log(`Lock acquired ${lockKey} for user ${userId}`);
    res.json({ message: "Lock acquired successfully" });
  } catch (err) {
    error("Lock acquisition failed", err);
    res.status(500).json({ message: "Failed to acquire lock" });
  }
};

/**
 * RELEASE LOCK
 * Uses atomic check-and-delete to ensure only the lock owner can release it
 */
exports.releaseLock = async (req, res) => {
  const { tableId, date, timeSlot } = req.body;
  const { userId } = getUserContext(req);

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  if (!tableId || !date || !timeSlot) {
    return res.status(400).json({ message: "tableId, date, and timeSlot are required" });
  }

  const lockKey = `lock:${tableId}:${date}:${timeSlot}`;

  try {
    // Atomic check-and-delete: only delete if lock exists and is owned by this user
    // Using Lua script for atomicity (check-then-delete)
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    
    const result = await redis.eval(luaScript, 1, lockKey, userId);
    
    if (result === 0) {
      // Lock doesn't exist or is owned by someone else
      const lockOwner = await redis.get(lockKey);
      if (!lockOwner) {
        return res.status(404).json({ message: "Lock does not exist or has expired" });
      }
      return res.status(403).json({ message: "Not authorized to release this lock" });
    }

    log(`Lock released ${lockKey} by user ${userId}`);
    res.json({ message: "Lock released successfully" });
  } catch (err) {
    error("Lock release failed", err);
    res.status(500).json({ message: "Failed to release lock" });
  }
};
