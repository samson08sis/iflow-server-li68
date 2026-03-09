const User = require("../models/User");
const { generateOtp } = require("../services/otp.service");
const { AppError, handleError } = require("../utils/errorHandler");

const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) throw new AppError("Phone number is required", 400);

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
    }

    const { code, expiresAt } = generateOtp();
    user.otp = { code, expiresAt, attempts: 0 };

    await user.save();

    // LATER: Integrate SMS provider here...
    console.log(`OTP for ${phoneNumber}: ${code}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

async function verifyOtp(req, res) {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      throw new AppError("Phone number and OTP code are required", 400);
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) throw new AppError("User not found", 404);

    if (!user.otp || !user.otp.code) {
      throw new AppError("No OTP generated for this user", 400);
    }

    // Check expiry
    if (new Date() > user.otp.expiresAt) {
      throw new AppError("OTP has expired", 400);
    }

    // Check attempts
    if (user.otp.attempts >= 5) {
      throw new AppError(
        "Too many failed attempts. Please request a new OTP.",
        429
      );
    }

    // Validate code
    if (user.otp.code !== otp) {
      user.otp.attempts += 1;
      await user.save();
      throw new AppError("Invalid OTP", 400);
    }

    // Success: reset OTP, mark verified, update last login
    user.isVerified = true;
    user.lastLogin = new Date();
    user.otp = { code: null, expiresAt: null, attempts: 0 };

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: {
        phoneNumber: user.phoneNumber,
        profile: user.profile,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = { sendOtp, verifyOtp };
