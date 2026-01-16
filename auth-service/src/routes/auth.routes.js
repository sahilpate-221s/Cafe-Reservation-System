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

const {
  verifyToken,
  requireAdmin,
} = require("../middleware/auth.middleware");

/* =========================
   PUBLIC ROUTES
========================= */
router.post("/register", register);
router.post("/login", login);

/* =========================
   PROTECTED ROUTES
========================= */
router.use(verifyToken);

router.get("/me", getMe);
router.put("/profile", updateProfile);
router.delete("/profile", deleteProfile);

// Internal / Admin / Self access
router.get("/user/:id", getUserById);

/* =========================
   ADMIN ROUTES
========================= */
router.get("/admin", requireAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
