const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String, // coffee, snacks, dessert
      required: true,
      index: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    imageUrl: {
      type: String, // future-ready (S3 / CDN)
    },

    isVeg: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
