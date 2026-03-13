const express = require("express");
const {
  sendOtp,
  verifyOtp,
  logout,
  destroyOtherSessions,
  refreshToken,
} = require("../controllers/auth.controller");
const User = require("../models/User");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);
router.post("/destroy-other-sessions", destroyOtherSessions);
router.post("/refresh-token", refreshToken);

module.exports = router;
