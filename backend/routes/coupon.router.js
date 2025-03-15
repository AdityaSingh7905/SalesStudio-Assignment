const express = require("express");
const {
  claimCoupon,
  addCoupon,
} = require("../controllers/coupon.controller");

const couponRouter = express.Router();

console.log("Coupon Router is Running!!");

couponRouter.post("/claim", claimCoupon);
couponRouter.post("/add", addCoupon);

module.exports = couponRouter;
