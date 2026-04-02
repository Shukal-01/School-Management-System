const express = require("express");
const otpRateLimiter = require("../middlewares/limiterValidator");
const {
  userSignup,
  userLogin,
  changePassword,
  forgetPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");
const protect = require("../middlewares/protect");

const userRouter = express.Router();

userRouter.post("/signup", userSignup);
userRouter.post("/login", userLogin);
userRouter.post("/change-password", protect, changePassword);
userRouter.post("/forget-password", otpRateLimiter, forgetPassword);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/reset-password", resetPassword);

module.exports = userRouter;
