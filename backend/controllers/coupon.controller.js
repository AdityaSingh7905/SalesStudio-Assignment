const Coupon = require("../model/coupon.model");
const crypto = require("crypto");

const COOLDOWN_PERIOD = 120000; // 2 minutes in milliseconds

// Helper to get user's IP
const getUserIP = (req) =>
  req.headers["x-forwarded-for"] || req.socket.remoteAddress;

// Helper to generate unique session identifier (cookie)
const generateSessionId = () => crypto.randomBytes(16).toString("hex");

// Claim Coupon
const claimCoupon = async (req, res) => {
  const userIP = getUserIP(req);
  const sessionId = req.cookies?.sessionId || generateSessionId();

  // Check recent claim via IP or session ID
  const recentClaim = await Coupon.findOne({
    $or: [{ claimedBy: userIP }, { claimedBy: sessionId }],
    claimedAt: { $gte: new Date(Date.now() - COOLDOWN_PERIOD) },
  });

  if (recentClaim) {
    const timeLeft = Math.ceil(
      (recentClaim.claimedAt.getTime() + COOLDOWN_PERIOD - Date.now()) / 60000
    );
    return res.status(403).json({
      message: `Can't claim another coupon before ${timeLeft} minutes.`,
    });
  }

  // Calculate expiry date (one month from now)
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  // Assign next available coupon
  const nextCoupon = await Coupon.findOneAndUpdate(
    { claimed: false },
    {
      claimed: true,
      claimedBy: userIP,
      claimedAt: new Date(),
      expiresAt, //Dynamically set expiry date
    },
    { new: true }
  );

  if (!nextCoupon)
    return res.status(404).json({ message: "No coupons available." });

  // Calculate time left in days for user
  const timeUntilExpiry = Math.ceil(
    (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24) // Days calculation
  );

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    maxAge: COOLDOWN_PERIOD,
  });
  res.status(200).json({
    message: `Successfully claimed coupon: ${nextCoupon.code}`,
    validFor: `${timeUntilExpiry} days`, // Inform the user about expiry period
  });
};

// Add Coupon (Single Entry)
const addCoupon = async (req, res) => {
  const { code, claimed, claimedBy, claimedAt, expiresAt } = req.body;
  console.log("Data Submitted: ", code);

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Coupon code and expiry date are required.",
    });
  }

  try {
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists.",
      });
    }

    const newCoupon = new Coupon({
      code,
      claimed: claimed || false,
      claimedBy: claimedBy || null,
      claimedAt: claimedAt || null,
      expiresAt: expiresAt || null,
    });

    await newCoupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon added successfully!",
      data: newCoupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add coupon",
      error: error.message,
    });
  }
};

module.exports = {
  claimCoupon,
  addCoupon,
};
