const express = require("express");
const {
  sendOtp,
  verifyOtp,
  logout,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);

module.exports = router;
