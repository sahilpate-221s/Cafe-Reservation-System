const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');

// Routes
router.post('/book', reservationController.bookTable);
router.post('/lock', reservationController.acquireLock);
router.post('/unlock', reservationController.releaseLock);
router.put('/cancel/:id',  reservationController.cancelReservation);
router.get('/my', reservationController.getMyReservations);
router.get('/all',  reservationController.getAllReservations);

module.exports = router;
