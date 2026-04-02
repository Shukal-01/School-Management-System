const rateLimit = require("express-rate-limit");

// Rate Limiter for OTP Requests
const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 OTP verification attempts per window
  message: {
    success: false,
    message: "Too many attempts. Please try again after 10 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = otpRateLimiter;
