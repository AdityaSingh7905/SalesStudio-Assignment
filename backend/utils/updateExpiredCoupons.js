const Coupon = require("../model/coupon.model");

// Function to reset expired coupons
const updateExpiredCoupons = async () => {
  try {
    // Check if All coupons are claimed
    const totalCoupons = await Coupon.countDocuments();
    const claimedCoupons = await Coupon.countDocuments({ claimed: true });

    if (totalCoupons > 0 && claimedCoupons === totalCoupons) {
      console.log(
        "All coupons claimed! Starting 2-minute timer for renewal..."
      );

      // Set Timer for 2 minutes (120,000 ms)
      setTimeout(async () => {
        await Coupon.updateMany(
          {},
          {
            claimed: false,
            claimedBy: null,
            claimedAt: null,
          }
        );

        console.log("All coupons have been renewed after 2 minutes.");
      }, 2 * 60 * 1000); // 2 minutes in milliseconds
    }
  } catch (error) {
    console.error("Error updating expired coupons:", error.message);
  }
};

module.exports = {
  updateExpiredCoupons,
};
