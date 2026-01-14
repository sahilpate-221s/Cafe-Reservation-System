const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { log, error } = require("../utils/logger");

/**
 * REGISTER
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
      status: "ACTIVE",
    });

    log(`User registered: ${user.email}`);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    error("Register error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * LOGIN
 */
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

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    log(`User logged in: ${user.email}`);

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

/**
 * UPDATE PROFILE
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, preferences } = req.body;
    const userId = req.user.userId;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (preferences !== undefined) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    log(`User profile updated: ${user.email}`);

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

/**
 * GET ME
 */
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      preferences: user.preferences || {
        notifications: true,
        newsletter: false,
        dietaryRestrictions: ''
      }
    });
  } catch (err) {
    error("Get me error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET USER BY ID (for internal services)
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    // Allow access if admin, requesting own data, or internal call
    if (role !== "ADMIN" && userId !== id && req.headers['x-internal-call'] !== 'true') {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(id);
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

/**
 * DELETE PROFILE
 */
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    log(`User profile deleted: ${user.email}`);

    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    error("Delete profile error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
