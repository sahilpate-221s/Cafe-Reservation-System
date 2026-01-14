const Table = require("../models/table.model");
const { log } = require("../utils/logger");

exports.createTable = async (req, res) => {
  try {
    const {
      tableNumber,
      capacity,
      name,
      location,
      view,
      image,
    } = req.body;

    // Validate required fields
    if (
      !tableNumber ||
      !capacity ||
      !name ||
      !location ||
      !view ||
      !image
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check for duplicate table number
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(409).json({
        message: "Table with this tableNumber already exists",
      });
    }

    const table = await Table.create({
      tableNumber,
      capacity,
      name,
      location,
      view,
      image,
    });

    log("Table created successfully");

    res.status(201).json({
      message: "Table created successfully",
      data: table,
    });
  } catch (err) {
    console.error("Create table error:", err.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.status(200).json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tableNumber,
      capacity,
      name,
      location,
      view,
      image,
    } = req.body;

    // Validate required fields
    if (
      !tableNumber ||
      !capacity ||
      !name ||
      !location ||
      !view ||
      !image
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if table exists
    const existingTable = await Table.findById(id);
    if (!existingTable) {
      return res.status(404).json({
        message: "Table not found",
      });
    }

    // Check for duplicate table number (excluding current table)
    const duplicateTable = await Table.findOne({
      tableNumber,
      _id: { $ne: id }
    });
    if (duplicateTable) {
      return res.status(409).json({
        message: "Table with this tableNumber already exists",
      });
    }

    const updatedTable = await Table.findByIdAndUpdate(
      id,
      {
        tableNumber,
        capacity,
        name,
        location,
        view,
        image,
      },
      { new: true }
    );

    log("Table updated successfully");

    res.status(200).json({
      message: "Table updated successfully",
      data: updatedTable,
    });
  } catch (err) {
    console.error("Update table error:", err.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTable = await Table.findByIdAndDelete(id);

    if (!deletedTable) {
      return res.status(404).json({
        message: "Table not found",
      });
    }

    log("Table deleted successfully");

    res.status(200).json({
      message: "Table deleted successfully",
    });
  } catch (err) {
    console.error("Delete table error:", err.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
