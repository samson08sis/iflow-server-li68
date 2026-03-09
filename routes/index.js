const express = require("express");
const router = express.Router();

const testRoutes = require("./test.routes");
const authRoutes = require("./auth.routes");

router.use("/auth", authRoutes);
// Always keep last
router.use("/", testRoutes);

module.exports = router;
