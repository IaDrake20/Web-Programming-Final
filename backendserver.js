const express = require("express");
const path = require("path");
const app = express();

// import dotenv (.env)
require("dotenv").config();
//login details
const user = process.env.DB_USER;
const pswrd = process.env.DB_PASS;

const PORT = 3001;
const uri = `mongodb+srv://${user}:${pswrd}@cluster0.zpcyqgd.mongodb.net/test`;

//setup connection to mongodb
const { MongoClient } = require("mongodb");

// web socket stuff
// tutorial: https://ably.com/blog/web-app-websockets-nodejs
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 7071 });
// map of clients
const clients = new Map();

// register callback for when a client connects
wss.on("connection", (ws) => {
  console.log("client connected!");
  const id = uuidv4();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };

  // associate a client with some data (an id and color)
  clients.set(ws, metadata);

  // register callback for when client sends a message to server
  ws.on("message", (messageAsString) => {
    const message = JSON.parse(messageAsString);
    const metadata = clients.get(ws);

    // attach additional data to the message to be sent to everyone
    message.sender = metadata.id;
    message.color = metadata.color;

    const outbound = JSON.stringify(message);

    [...clients.keys()].forEach((client) => {
      client.send(outbound);
    });
  });

  // register callback for when client quits
  ws.on("close", () => {
    console.log("client left");
    clients.delete(ws);
  });
});

// generate a id
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let mongo;

async function main() {
  mongo = new MongoClient(uri);
  try {
    await mongo.connect();
    console.log("Connected to mongo!");
    //const db = mongo.db("db_loot");

    // // db_loot
    //const myCollection = db.collection("db_loot");

    // add to database
    // myCollection.insertOne({
    //   Name: "wooden bat",
    //   id: 0,
    //   value: 0,
    // }

    // //try to retrieve3
    // console.log(getRandomDBItem(1,2, myCollection));

    // // get results
    //let results = await myCollection.find({}).limit(50).toArray();
    //console.log(results);
  } catch (e) {
    console.error(e);
  }
}
main().catch(console.error);

async function getRandomDBItem(min, max, collection) {
  const randomNum = Math.floor(Math.random() * (max - min + 1) + min);
  let element = randomNum;
  const query = { id: element };
  const myItem = await collection.findOne(query);
  return myItem;
}

// allow parsing json body from POST requests (auth)
app.use(express.json());

// fix CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// endpoint to get a random item
// temp: currently only grabs items with ids 1-7
app.get("/random-item", async (req, res) => {
  const collection = mongo.db("db_loot").collection("Consumables");
  const item = await getRandomDBItem(1, 2, collection);
  res.json(item);
});
//handle username and password by chekcing the username against the db
//temp calls of auth-name and auth-pass for now until actual ones established
app.post("/auth-name", async (req, res) => {
  console.log(req.url);
  let name = req.body.name;
  let pass = req.body.pass;
  console.log(name);
  console.log(pass);
  const exists = await authenticateUser(name, pass);
  if (!exists) {
    console.log("user does not exist... adding to db");
    addUser(name, pass);
  } else {
    console.log("user exists");
  }
  res.end();
});

//make new

async function authenticateUser(name, password) {
  const collection = mongo.db("User_Info").collection("user");
  const query = { Username: name, Password: password };
  const myUser = await collection.findOne(query);
  console.log(myUser);
  return myUser;
}

async function addUser(name, password) {
  const collection = mongo.db("User_Info").collection("user");
  await collection.insertOne({
    Username: name,
    Password: password,
    Small_H: 0,
    Medium_H: 0,
    Large_H: 0,
    Small_M: 0,
    Medium_M: 0,
    Large_M: 0,
    Equipment_Feet: 0,
    Equipment_Chest: 0,
    Equipment_Arms: 0,
    Equipment_Head: 0,
    Equipment_Weapon: 0
  });
  console.log("user added to db");
}
/* Template for user inventory
Small_H: {number, P_h1Value},
    Medium_H: {number, P_h2Value},
    Large_H: {number, P_h3Value},
    Small_M: {number, P_m1Value},
    Medium_M: {number, P_m2Value},
    Large_M: {number, P_m3Value},
    Equipment_Feet: {E_fName, E_fValue},
    Equipment_Chest: {E_cName, E_cValue},
    Equipment_Arms: {E_aName, E_aValue},
    Equipment_Head: {E_hName, E_hValue}
*/

async function add

// temp
app.get("/", (req, res) => {
  res.send("Hello backend server");
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
