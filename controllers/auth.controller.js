const User = require("../models/User");
const { generateOtp } = require("../services/otp.service");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/token.service");
const { AppError, handleError } = require("../utils/errorHandler");
const { formatPhoneNumber, formatString } = require("../utils/stringFormatter");

const sendOtp = async (req, res) => {
  try {
    let { phoneNumber, name } = req.body;
    phoneNumber = formatPhoneNumber(phoneNumber);

    if (!phoneNumber) throw new AppError("Phone number is required", 400);

    let user = await User.findOne({ phoneNumber });
    let isNewUser;

    if (!user) {
      isNewUser = true;
      if (!name) {
        return res.status(200).json({
          success: false,
          message:
            "No Account found with the number you entered. Please provide Full Name to sign up.",
          loginType: "signup",
        });
      }

      name = formatString(name);
      user = new User({ phoneNumber, profile: { name } });
    }

    const { code, expiresAt } = generateOtp();
    user.otp = { code, expiresAt, attempts: 0 };

    await user.save();

    // LATER: Integrate SMS provider here...
    console.log(
      `OTP for ${phoneNumber}: ${code} | Time: ${new Date().toLocaleTimeString()}`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      loginType: isNewUser ? "signup" : "login",
      otpExpiry: user.otp.expiresAt.toISOString(), // UTC
    });
  } catch (error) {
    handleError(res, error);
  }
};

async function verifyOtp(req, res) {
  try {
    let { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      throw new AppError("Phone Number & OTP are required", 400);
    }

    phoneNumber = formatPhoneNumber(phoneNumber);
    otp = formatString(otp);

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.otp || !user.otp.code) {
      throw new AppError("User not found", 400);
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

    // Success: reset OTP, mark verified, update last login, check if new user
    const isNewUser = !user.isVerified;
    user.isVerified = true;
    user.lastLogin = new Date();
    user.otp = { code: null, expiresAt: null, attempts: 0 };

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Limit session limit (max 3)
    user.refreshTokens.push(refreshToken);
    if (user.refreshTokens.length > 3) {
      user.refreshTokens.shift();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      loginType: isNewUser ? "signup" : "login",
      tokens: { token, refreshToken },
      user: {
        phoneNumber: user.phoneNumber,
        profile: user.profile,
        role: user.role,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function logout(req, res) {
  try {
    let { refreshToken } = req.body;

    if (!refreshToken) throw new AppError("Refresh token is required", 400);
    refreshToken = formatString(refreshToken);

    // Verify user by refresh token
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (!user) throw new AppError("Invalid session or already logged out", 401);

    // Remove the refresh token from active sessions
    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged out successfully. Session destroyed.",
    });
  } catch (error) {
    handleError(res, error);
  }
}

// Log out of other devices
async function destroyOtherSessions(req, res) {
  try {
    let { refreshToken } = req.body;

    if (!refreshToken) throw new AppError("Refresh token is required", 400);
    refreshToken = formatString(refreshToken);

    // Find user who owns this refresh token
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (!user) throw new AppError("Invalid session", 401);

    // Keep only the current refresh token, drop all others
    user.refreshTokens = user.refreshTokens.filter(
      (token) => token === refreshToken
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged out of all other devices successfully.",
    });
  } catch (error) {
    handleError(res, error);
  }
}

// Refresh Access Token
async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError("Refresh token is required", 400);

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new AppError("Invalid or expired refresh token", 401);

    // Find user to ensure they still exist and are active
    const user = await User.findById(payload.id);
    if (!user) throw new AppError("User not found", 404);

    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  sendOtp,
  verifyOtp,
  logout,
  destroyOtherSessions,
  refreshToken,
};
