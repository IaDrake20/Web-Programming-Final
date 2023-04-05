const express = require("express");
const path = require("path");

//path to database
const path_lootGen = "/db/loot_generator";

const app = express();
const PORT = 3001;

//db_loot.get('SELECT * FROM Items ORDER BY RANDOM')

// temp
app.get("/", (req, res) => {
  res.send("Hello backend server");
});

const item = {
  Name: "default",
  Value: "0",
};

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
