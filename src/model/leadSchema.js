const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    },
    phone: {
      type: String,
      required: true,
      match: /^[6-9][0-9]{9}$/, // Phone validation (Indian numbers)
    },
    companyName: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    comments: {
      type: String,
    },
    services: {
      companyBranding: { type: Boolean, default: false },
      productLaunch: { type: Boolean, default: false },
      individualPR: { type: Boolean, default: false },
      consultation: { type: Boolean, default: false },
      pressRelease: { type: Boolean, default: false },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to user model
      required: true,
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
module.exports = Lead;
