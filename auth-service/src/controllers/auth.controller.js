const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { log, error } = require("../utils/logger");

/* =========================
   HELPERS
========================= */
const generateToken = (user) =>
  jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
      status: "ACTIVE",
    });

    log(`User registered | email=${email}`);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // Mongo unique index protection
    if (err.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }

    error("Register error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ message: "Account is blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    log(`User logged in | email=${email}`);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    error("Login error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   UPDATE PROFILE
========================= */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phone, preferences } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (preferences !== undefined) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    log(`Profile updated | user=${user.email}`);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    error("Update profile error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   GET ME
========================= */
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      preferences: user.preferences || {
        notifications: true,
        newsletter: false,
        dietaryRestrictions: "",
      },
    });
  } catch (err) {
    error("Get me error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   GET USER BY ID (INTERNAL)
========================= */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const isInternalCall = req.headers["x-internal-call"] === "true";

    if (role !== "ADMIN" && userId !== id && !isInternalCall) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    error("Get user by ID error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   DELETE PROFILE
========================= */
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    log(`Profile deleted | user=${user.email}`);

    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    error("Delete profile error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
