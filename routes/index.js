const express = require("express");
const router = express.Router();

const testRoutes = require("./test.routes");
const authRoutes = require("./auth.routes");
const vehicleRoutes = require("./vehicle.routes");

router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);
// Always keep last
router.use("/", testRoutes);

module.exports = router;
