const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      trim: true,
      default: "EzFix",
    },
    tagline: {
      type: String,
      trim: true,
      default: "Your ultimate service provider",
    },
    logo: {
      type: String,
      trim: true,
      default: "https://via.placeholder.com/150x50?text=Logo",
    },
    currency: {
      type: String,
      trim: true,
      default: "INR",
    },
    timezone: {
      type: String,
      trim: true,
      default: "Asia/Kolkata",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);
