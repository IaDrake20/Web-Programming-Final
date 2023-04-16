const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "/client")));
app.use(express.static(path.join(__dirname, "/public")));

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "homepage.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// differentiate between a solo and online game session.
// also pass sessionId to the client as a url param
app.get("/:sessionId", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"), { sessionId: req.params.sessionId });
});

app.listen(PORT, () => {
  console.log(`Main server listening on port ${PORT}`);
});
