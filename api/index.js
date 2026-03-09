const express = require("express");
const serverless = require("serverless-http");

const port = process.env.PORT || 7002;

const app = express();

app.get("/test", (req, res) => {
  res.json({ message: "ok" });
});

// Deployment
module.exports = serverless(app);

// Development
// app.listen(port, () => {
//   `Server started on port ${port}!`;
//   console.log(`Server started on port ${port}`);
// });
