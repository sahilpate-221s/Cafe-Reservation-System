const express = require("express");
const router = express.Router();
const { createTable, getTables, updateTable, deleteTable } = require("../controllers/table.controller");

router.post("/", createTable);
router.get("/", getTables);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

module.exports = router;
