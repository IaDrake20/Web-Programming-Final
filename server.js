const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "/client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Main server listening on port ${PORT}`);
});

//2nd backend server for handling loot and information from database
const backend = express();


// `npm run start` or `node server.js` to run the server
