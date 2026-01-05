const express = require("express");
const router = express.Router();
const {
  bookTable,
  cancelReservation,
  getMyReservations,
  getAllReservations,
} = require("../controllers/reservation.controller");

router.post("/book", bookTable);
router.delete("/:id", cancelReservation);
router.get("/me", getMyReservations);
router.get("/", getAllReservations);

module.exports = router;
