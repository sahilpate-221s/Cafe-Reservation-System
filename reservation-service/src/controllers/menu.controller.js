const Menu = require("../models/menu.model");
const { getUserContext } = require("../middleware/auth.context");
const { log, error } = require("../utils/logger");

/**
 * ADMIN: Create Menu Item
 */
exports.createMenu = async (req, res) => {
  const { role } = getUserContext(req);

  if (role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const menu = await Menu.create(req.body);
    log(`Menu created: ${menu.name}`);
    res.status(201).json(menu);
  } catch (err) {
    error("Create menu failed", err);
    res.status(500).json({ message: "Failed to create menu" });
  }
};

/**
 * USER + ADMIN: Get Menus
 */
exports.getMenus = async (req, res) => {
  const { role } = getUserContext(req);

  try {
    const filter = role === "ADMIN" ? {} : { isAvailable: true };
    const menus = await Menu.find(filter).sort({ displayOrder: 1 });
    res.json(menus);
  } catch (err) {
    error("Fetch menus failed", err);
    res.status(500).json({ message: "Failed to fetch menus" });
  }
};

/**
 * ADMIN: Update Menu Item
 */
exports.updateMenu = async (req, res) => {
  const { role } = getUserContext(req);
  const { id } = req.params;

  if (role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const menu = await Menu.findByIdAndUpdate(id, req.body, { new: true });

    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    log(`Menu updated: ${menu.name}`);
    res.json(menu);
  } catch (err) {
    error("Update menu failed", err);
    res.status(500).json({ message: "Failed to update menu" });
  }
};

/**
 * ADMIN: Delete Menu Item
 */
exports.deleteMenu = async (req, res) => {
  const { role } = getUserContext(req);
  const { id } = req.params;

  if (role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const menu = await Menu.findByIdAndDelete(id);

    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    log(`Menu deleted: ${menu.name}`);
    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    error("Delete menu failed", err);
    res.status(500).json({ message: "Failed to delete menu" });
  }
};
