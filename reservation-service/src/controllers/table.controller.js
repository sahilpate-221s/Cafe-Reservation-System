const Table = require("../models/table.model");
const { log } = require("../utils/logger");

exports.createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    if (!tableNumber || !capacity) {
      return res.status(400).json({ message: "tableNumber and capacity required" });
    }

    const table = await Table.create({ tableNumber, capacity });
    console.log("Table created:", table);

    res.status(201).json(table);
  } catch (err) {
    console.error("Create table error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getTables = async (req, res) => {
  const tables = await Table.find();
  res.json(tables);
};
