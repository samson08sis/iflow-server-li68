const express = require("express");
const {
  sendOtp,
  verifyOtp,
  logout,
  destroyOtherSessions,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);
router.post("/destroy-other-sessions", destroyOtherSessions);

module.exports = router;
