const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    claimed: {
      type: Boolean,
      default: false,
    },
    claimedBy: {
      type: String,
      default: null,
    }, // Stores IP or cookie ID
    claimedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    }, // Expiry date for the coupon
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
