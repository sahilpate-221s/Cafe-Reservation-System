const Table = require("../models/table.model");
const { log } = require("../utils/logger");

/* =========================
   CREATE TABLE
========================= */
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, name, location, view, image } = req.body;

    if (!tableNumber || !capacity || !name || !location || !view || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const table = await Table.create({
      tableNumber,
      capacity,
      name,
      location,
      view,
      image,
    });

    log(`Table created | tableNumber=${tableNumber}`);

    res.status(201).json({
      message: "Table created successfully",
      data: table,
    });
  } catch (err) {
    // Mongo unique index safeguard
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Table with this tableNumber already exists",
      });
    }

    console.error("Create table error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   GET TABLES
========================= */
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find()
      .sort({ tableNumber: 1 })
      .lean(); // faster, read-only

    res.status(200).json(tables);
  } catch (err) {
    console.error("Get tables error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   UPDATE TABLE
========================= */
exports.updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity, name, location, view, image } = req.body;

    if (!tableNumber || !capacity || !name || !location || !view || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedTable = await Table.findOneAndUpdate(
      { _id: id },
      { tableNumber, capacity, name, location, view, image },
      { new: true, runValidators: true }
    );

    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    log(`Table updated | id=${id}`);

    res.status(200).json({
      message: "Table updated successfully",
      data: updatedTable,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Table with this tableNumber already exists",
      });
    }

    console.error("Update table error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   DELETE TABLE
========================= */
exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTable = await Table.findByIdAndDelete(id);

    if (!deletedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    log(`Table deleted | id=${id}`);

    res.status(200).json({
      message: "Table deleted successfully",
    });
  } catch (err) {
    console.error("Delete table error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
