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
app.get("/Consumables", async (req, res) => {
  console.log("Consumable requested...");
  const collection = mongo.db("db_loot").collection("Consumables");
  const item = await getRandomDBItem(1, 6, collection);
  res.json(item);
  console.log("Consumable retrieved! " + item.name);
});
app.get("/Equipment", async (req, res) => {
  console.log("Equipment Requested...");
  const collection = mongo.db("db_loot").collection("Equipment");
  const item = await getRandomDBItem(1, 36, collection);
  res.json(item);
  console.log("Equipment retrieved! " + item.name);
});
app.get("/Weapons", async (req, res) => {
  console.log("Weapon requested...");
  const collection = mongo.db("db_loot").collection("Weapons");
  const item = await getRandomDBItem(1, 8, collection);
  res.json(item);
  console.log("Weapon retrieved! " + item.name);
});
app.get("/Mobs", async (req, res) => {
  console.log("Mob requested...");
  const collection = mongo.db("db_enemy").collection("mobs");
  const item = await getRandomDBItem(1, 2, collection);
  res.json(item);
  console.log(item.description);
});
app.get("/Events", async (req, res) => {
  console.log("Mob requested...");
  const collection = mongo.db("db_events").collection("events");
  const item = await getRandomDBItem(1, 7, collection);
  res.json(item);
  console.log(item.description);
});

//handle username and password by checking the username against the db
// deprecated, use /signup and /login instead
app.post("/auth-name", async (req, res) => {
  console.log(req.url);
  let name = req.body.name;
  let pass = req.body.pass;
  console.log(name);
  console.log(pass);

  let exists = await findUser(name);
  console.log("Exists is " + exists.valueOf());
  if (exists == false) {
    console.log("user does not exist... adding to db");
    addUser(name, pass);
  } else if (exists == true) {
    console.log("get fucked2");
    const user = loginUser(name, pass);
  } else {
    console.log("get fucked");
  }
  res.end();
});

app.post("/signup", async (req, res) => {
  let name = req.body.name;
  let pass = req.body.pass;

  // 400 bad request
  if (!name || !pass) {
    res.status(400).send("Missing username or password...");
    return;
  }

  let exists = await findUser(name);
  // 409 conflict in resource
  if (exists) {
    res.status(409).send("User already exists...");
    return;
  }

  addUser(name, pass);
  // 200 OK
  res.status(200).send("Account created!");
});

app.post("/login", async (req, res) => {
  let name = req.body.name;
  let pass = req.body.pass;

  // 400 bad request
  if (!name || !pass) {
    res.status(400).send("Missing username or password...");
    return;
  }

  let exists = await findUser(name);
  // 401 invalid credentials
  if (!exists) {
    res.status(401).send("User cannot be found...");
    return;
  }

  let user = await loginUser(name, pass);
  // 401 invalid credentials
  if (!user) {
    res.status(401).send("Invalid password...");
    return;
  }

  // 200 OK
  res.status(200).send(JSON.stringify({ userData: user }));
});

app.post("/logout", async (req, res) => {
  // can do some stuff here, like remove user from a game 'session'
  res.status(200).send("Logout success!");
});

//check to see if user exists in db
async function findUser(name) {
  const collection = mongo.db("User_Info").collection("user");
  const query = { Username: name };
  var myUser = await collection.findOne(query);
  //console.log(myUser);

  if (myUser == null) {
    console.log("in finduser return set to false;");
    myUser = false;
  } else {
    myUser = true;
  }
  return myUser;
}

//login. IAN: Could be combined with Adduser to do more with less code, fine for now
async function loginUser(name, password) {
  const collection = mongo.db("User_Info").collection("user");
  const query = { Username: name, Password: password };
  const user = await collection.findOne(query);
  //console.log("In loginUser doesExist == "+doesExist.valueOf());
  if (user) {
    console.log("Logging " + name + " in.");
    return user;
  } else {
    console.log(name + " tried to login in with incorrect password " + password);
    return null;
  }
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
    Equipment_Weapon: 0,
    World_Current_Stage: 0,
    World_Chaos_Level: 0,
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

//update user info

async function updateUser(name) {
  const collection = mongo.db("User_Info").collection("user");
  await collection.findOne({ Username: name });
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
    Equipment_Weapon: 0,
  });
}

// temp
app.get("/", (req, res) => {
  res.send("Hello backend server");
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
