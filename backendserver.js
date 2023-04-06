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

let mongo;

async function main() {
  mongo = new MongoClient(uri);
  try {
    await mongo.connect();
    console.log("Connected to mongo!");
    // const db = mongo.db("db_loot");

    // // db_loot
    // const myCollection = db.collection("db_loot");

    // add to database
    // myCollection.insertOne({
    //   Name: "wooden bat",
    //   id: 0,
    //   value: 0,
    // });

    // //try to retrieve wooden bat
    // console.log(getRandomDBItem(1,2, myCollection));

    // // get results
    // let results = await myCollection.find({}).limit(50).toArray();
    // console.log(results);
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

// fix CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// endpoint to get a random item
// temp: currently only grabs item with id=0
app.get("/random-item", async (req, res) => {
  const collection = mongo.db("db_loot").collection("db_loot");
  const item = await getRandomDBItem(0, 0, collection);
  res.json(item);
});

// temp
app.get("/", (req, res) => {
  res.send("Hello backend server");
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
