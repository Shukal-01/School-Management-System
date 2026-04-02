const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

// User Signup
const userSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(401)
        .json({ success: false, message: "User already registered!" });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// User Login
const userLogin = async (req, res) => {
  const { userName, password } = req.body;

  try {
    // Find the user by email and include password
    const user = await User.findOne({ userName }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid user credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res
      .status(200)

      .json({
        success: true,
        token,
        user: user,
        message: "Login successfully!",
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id; // Get user ID from middleware

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Check if old password is correct
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect old password!" });
    }

    // Ensure new password is different from old password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as old password!",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// Forget Password
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Store hashed OTP and expiration in the database
    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    // Send the OTP email
    const message = `Your password reset OTP is: ${otp}. It is valid for the next 10 minutes.`;
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: message,
    });

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordExpire: { $gt: Date.now() }, // Ensure OTP is still valid
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (user.resetPasswordOtp !== hashedOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    res
      .status(200)
      .json({ success: true, message: "OTP matched successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Update the password and clear OTP fields
    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  userSignup,
  userLogin,
  changePassword,
  forgetPassword,
  verifyOTP,
  resetPassword,
};
