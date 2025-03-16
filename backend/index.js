const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { mongoConnect } = require("./config/db.js");
const couponRouter = require("./routes/coupon.router.js");
const { updateExpiredCoupons } = require("./utils/updateExpiredCoupons.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoConnect();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/coupons", couponRouter);

// Run expired coupon update every hour
setInterval(updateExpiredCoupons, 60 * 1000); // Runs every minute

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
