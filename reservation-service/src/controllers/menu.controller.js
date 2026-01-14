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
    const menuData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      isAvailable: req.body.available !== undefined ? req.body.available : true,
      imageUrl: req.body.imageUrl,
      isVeg: req.body.isVeg !== undefined ? req.body.isVeg : true,
      displayOrder: req.body.displayOrder || 0,
    };
    const menu = await Menu.create(menuData);
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
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = req.body.price;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.available !== undefined) updateData.isAvailable = req.body.available;
    if (req.body.imageUrl !== undefined) updateData.imageUrl = req.body.imageUrl;
    if (req.body.isVeg !== undefined) updateData.isVeg = req.body.isVeg;
    if (req.body.displayOrder !== undefined) updateData.displayOrder = req.body.displayOrder;

    const menu = await Menu.findByIdAndUpdate(id, updateData, { new: true });

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
