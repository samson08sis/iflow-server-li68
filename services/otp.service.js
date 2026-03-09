const crypto = require("crypto");

function generateOtp() {
  const code = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
  return { code, expiresAt };
}

module.exports = { generateOtp };
