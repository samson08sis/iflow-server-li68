require("dotenv").config();

const connectDB = require("../config/db");
const express = require("express");
const routes = require("../routes");
const port = process.env.PORT || 7002;

const app = express();

// Connect DB
(async () => {
  await connectDB();
})();

// All routes
app.use("/", routes);

// Development
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
