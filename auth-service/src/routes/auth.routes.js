const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  getUserById,
  updateProfile,
  deleteProfile,
} = require("../controllers/auth.controller");

const { verifyToken, requireAdmin } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);

// protected test route
router.get("/me", verifyToken, getMe);

// admin-only test
router.get("/admin", verifyToken, requireAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

// update profile
router.put("/profile", verifyToken, updateProfile);

// delete profile
router.delete("/profile", verifyToken, deleteProfile);

// get user by id (for internal services - requires admin or self)
router.get("/user/:id", verifyToken, getUserById);

module.exports = router;
