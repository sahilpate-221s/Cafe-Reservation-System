const express = require("express");
const router = express.Router();
const {
  getAvailability,
} = require("../controllers/availability.controller");

router.get("/", getAvailability);

module.exports = router;
