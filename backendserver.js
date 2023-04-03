const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001;

// temp
app.get("/", (req, res) => {
  res.send("Hello backend server");
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
