const express = require("express");
const router = express.Router();

const {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu.controller");

router.post("/", createMenu);        // ADMIN
router.get("/", getMenus);           // PUBLIC (for menu display)
router.put("/:id", updateMenu);      // ADMIN
router.delete("/:id", deleteMenu);   // ADMIN

module.exports = router;
