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

/**
 *
 * Start ws region
 *
 */

// tutorial: https://ably.com/blog/web-app-websockets-nodejs

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 7071 });

// map of clients
const clients = new Map();
let numClients = 0;

// index of the client who's turn it is
let clientTurn = 0;

// register callback for when a client connects
wss.on("connection", (ws) => {
  console.log("client connected!");
  const id = numClients++;
  const metadata = { id };

  // associate a client with some data (an id and color)
  clients.set(ws, metadata);

  // register callback for when client sends a message to server
  ws.on("message", (messageAsString) => {
    const msg = JSON.parse(messageAsString);

    console.log("Server received msg:", msg);

    const target = msg.target;
    const header = msg.header;
    const body = msg.body;

    const metadata = clients.get(ws);

    switch (target) {
      // msg does not get sent out to other clients
      // but, server may send a response to the sender
      case "server":
        handleServerMessage(header, body, metadata);
        break;

      // send msg to all other clients
      case "all":
        handleAllMessage(header, body, metadata);
        break;

      // target should always exist, so this represents msg to one
      // target value will be id of recipient
      // not implemented yet
      default:
        break;
    }

    /**
     *
     * TODO: remove all below this
     *
     */

    // // client ready message
    // if (message.msg === "ready") {
    //   const clientKeysArray = [...clients.keys()];
    //   const client = clientKeysArray[id];
    //   client.send(
    //     JSON.stringify({ id: id, sender: "server", msg: "Connected to server!", turn: turn })
    //   );
    //   return;
    // }
    // // end turn message
    // else if (message.msg === "end turn") {
    //   const metadata = clients.get(ws);
    //   clientTurn = (clientTurn + 1) % numClients;
    //   console.log(clientTurn);

    //   message.sender = metadata.id;
    //   message.msg = "Ended their turn";

    //   [...clients.keys()].forEach((client) => {
    //     const recieverMetadata = clients.get(client);
    //     let myTurn = clientTurn == recieverMetadata.id;
    //     console.log(myTurn, clientTurn, recieverMetadata.id);
    //     message.turn = myTurn;
    //     const outbound = JSON.stringify(message);
    //     client.send(outbound);
    //   });
    //   return;
    // }
    // // basic message
    // else {
    //   const metadata = clients.get(ws);

    //   // attach additional data to the message to be sent to everyone
    //   message.sender = metadata.id;

    //   const outbound = JSON.stringify(message);

    //   [...clients.keys()].forEach((client) => {
    //     client.send(outbound);
    //   });
    // }
  });

  // register callback for when client quits
  ws.on("close", () => {
    console.log("client left");
    numClients--;
    clients.delete(ws);
  });
});

const handleServerMessage = (header, body, senderMeta) => {
  switch (header) {
    case "ready":
      sendToClient("init", { id: senderMeta.id, turn: clientTurn }, senderMeta.id);
      break;
  }
};

const handleAllMessage = (header, body, senderMeta) => {
  // initialize empty body if none was provided
  if (!body) {
    body = {};
  }
  body.sender = senderMeta.id;

  // if extra functionality is needed, can define a case for your specific message
  // otherwise, server just relays message directly to other clients
  switch (header) {
    case "end turn":
      clientTurn = (clientTurn + 1) % numClients;
      body.turn = clientTurn;
      sendToAllClients("turn", body);
      break;
    case "wstest":
      body.color = "red";
      sendToAllClients(header, body);
      break;
    default:
      sendToAllClients(header, body);
      break;
  }
};

// send msg to client whos id is specified
const sendToClient = (header, body, id) => {
  const clientKeysArray = [...clients.keys()];
  const client = clientKeysArray[id];
  client.send(JSON.stringify({ header, body }));
  console.log("Server sending msg to one [id=" + id + "]:", { header, body });
};

// send msg to all clients
const sendToAllClients = (header, body) => {
  [...clients.keys()].forEach((client) => {
    client.send(JSON.stringify({ header, body }));
  });
  console.log("Server sending msg to all:", { header, body });
};

/**
 *
 * End ws region
 *
 */

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
app.post("/Equipment", async (req, res) => {
  console.log("Equipment Requested...");
  let info = req.body;
  const collection = mongo.db("db_loot").collection("Equipment");
  lowestEquipment = info.user.World_Current_Stage + ((info.user.World_Current_Stage - 1) * 4);
  const item = await getRandomDBItem(lowestEquipment, lowestEquipment + 3, collection);
  res.json(item);
  console.log("Equipment retrieved! " + item.name);
});
app.post("/Weapons", async (req, res) => {
  console.log("Weapon requested...");
  let info = req.body;
  const collection = mongo.db("db_loot").collection("Weapons");
  const item = await getRandomDBItem(info.user.World_Current_Stage, info.user.World_Current_Stage, collection);
  res.json(item);
  console.log("Weapon retrieved! " + item.name);
});
app.post("/Mobs", async (req, res) => {
  console.log("Mob requested...");
  let info = req.body;
  const collection = mongo.db("db_enemy").collection("mobs");
  const item = await getRandomDBItem(info.user.World_Current_Stage, info.user.World_Current_Stage + 2, collection);
  res.json(item);
  console.log(item.description);
});
app.post("/Bosses", async (req, res) => {
  console.log("Mob requested...");
  let info = req.body;
  const collection = mongo.db("db_enemy").collection("bosses");
  const item = await getRandomDBItem(info.user.World_Current_Stage, info.user.World_Current_Stage, collection);
  res.json(item);
  console.log(item.description);
});
app.get("/Events", async (req, res) => {
  console.log("Event requested...");
  const collection = mongo.db("db_events").collection("events");
  const item = await getRandomDBItem(1, 5, collection);
  res.json(item);
  console.log(item.description);
});
app.post("/Realms", async (req, res) => {
  console.log("Realm requested...");
  let info = req.body;
  const collection = mongo.db("db_realms").collection("realms");
  const item = await getRandomDBItem(info.user.World_Current_Stage, info.user.World_Current_Stage, collection);
  res.json(item);
  console.log("Realm retrieved! " + item.name);
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
    hp_max: 100,
    hp_current: 100,
    mana_current: 50,
    mana_max: 50,
    ap_current: 4,
    ap_max: 4,
    xp_current: 0,
    xp_threshold: 25,
    strength: 10,
    character_level_current: 1,
    score: 69,
    user: {
      Small_H: 0,
      Medium_H: 0,
      Large_H: 0,
      Small_M: 0,
      Medium_M: 0,
      Large_M: 0,
      Equipment_Legs: 0,
      Equipment_Chest: 0,
      Equipment_Arms: 0,
      Equipment_Head: 0,
      Equipment_Weapon: 0,
      World_Current_Stage: 1,
      World_Chaos_Level: 1,
    },
  });
  console.log("user added to db");
}


//update user info
app.post("/updateUser", async (req, res) => {
  console.log("Trying to overwrite user with current data...");
  const collection = mongo.db("User_Info").collection("user");
  let info = req.body;
  const username = info.Username;
  console.log("TEST PRINT USERNAME: "+username);
  let account = await collection.findOne({ Username: username });
  await collection.replaceOne({Username: username}, info);
  console.log(req.body);
  console.log(info);
});

app.post("/loadUser", async (req, res) => {
  console.log("Fetch recieved, getting player stats from db.");
  const collection = mongo.db("User_Info").collection("user");
  let username = req.body;
  let account = await collection.findOne(username);

  //might need to catch some errors here
  res.send(account);
})

// temp
app.get("/", (req, res) => {
  res.send("Hello backend server");
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
