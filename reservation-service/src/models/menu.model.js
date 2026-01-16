const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // frequently searched / displayed
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      index: true, // sorting / filtering friendly
    },

    category: {
      type: String, // coffee, snacks, dessert
      required: true,
      trim: true,
      index: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true, // very important for user queries
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    isVeg: {
      type: Boolean,
      default: true,
      index: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
      index: true, // sorting optimization
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Menu", menuSchema);
