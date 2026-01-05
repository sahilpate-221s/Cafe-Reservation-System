const express = require("express");
const router = express.Router();
const { createTable, getTables } = require("../controllers/table.controller");

router.post("/", createTable);
router.get("/", getTables);

module.exports = router;
