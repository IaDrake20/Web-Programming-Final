const express = require("express");
const path = require("path");
const sqlite3 = require('sqlite3');

//path to database
const path_lootGen = '/db/loot_generator';

const app = express();
const PORT = 3001;

const db_loot = sqlite3.Database(path_lootGen, (err) =>
    if(err) {
      console.error(err.message);
    }
    console.log('Connected to loot generator database');
)

// temp
app.get("/", (req, res) => {
  res.send("Hello backend server");
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
