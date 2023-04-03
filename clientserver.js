const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "/client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "homepage.html"));
});

app.listen(PORT, () => {
  console.log(`Main server listening on port ${PORT}`);
});