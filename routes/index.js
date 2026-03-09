const connectDB = require("../config/db");
const express = require("express");
const router = express.Router();

const testRoutes = require("./test.routes");

// Always keep last
router.use("/", testRoutes);

module.exports = router;
