const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // useful for admin/user listing
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // critical for login
    },

    password: {
      type: String,
      required: true,
      select: false, // never returned by default
    },

    phone: {
      type: String,
      trim: true,
      index: true, // optional but useful
    },

    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
      newsletter: {
        type: Boolean,
        default: false,
      },
      dietaryRestrictions: {
        type: String,
        trim: true,
      },
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
      index: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
      index: true, // important for auth checks
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* =========================
   INDEXES (FINAL SAFETY)
========================= */
// Case-insensitive unique email
userSchema.index(
  { email: 1 },
  { unique: true }
);

module.exports = mongoose.model("User", userSchema);
