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

module.exports = { sendOtp };
