const express = require("express");
const serverless = require("serverless-http");

const port = process.env.PORT || 7002;

const app = express();

app.get("/test-1", (req, res) => {
  return res.send("Welcome to iFlow!");
});
app.get("/test-2", (req, res) => {
  return res.json({ status: "ok", message: "Welcome to iFlow!" });
});
app.get("/", (req, res) => {
  return res.json({ status: "ok", message: "Welcome to iFlow!" });
});

// // Deployment
module.exports = serverless(app);

// // Development
// app.listen(port, () => {
//   `Server started on port ${port}!`;
//   console.log(`Server started on port ${port}`);
// });
