const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/auth.controller");

const { verifyToken, requireAdmin } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);

// protected test route
router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Token valid",
    user: req.user,
  });
});

// admin-only test
router.get("/admin", verifyToken, requireAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
