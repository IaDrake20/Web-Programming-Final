const express = require("express");
const path = require("path");
const app = express();

// import dotenv (.env)
require("dotenv").config();
//login details
const user = process.env.DB_USER;
console.log(user);
const pswrd = process.env.DB_PASS;
console.log(pswrd);

const PORT = 3001;
const uri = `mongodb+srv://${user}:${pswrd}@cluster0.zpcyqgd.mongodb.net/test`; //need safer way to store password, maybe enviornment or something

//setup connection to mongodb
const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient(uri);
  try {
    const mongo = await client.connect();
    console.log("Connected to mongo!");
    const db = mongo.db("db_loot");

    // db_loot
    const myCollection = db.collection("db_loot");

    // add to database
    myCollection.insertOne({
      Name: "wooden bat",
      id: 0,
      value: 0,
    });

    // get results
    let results = await myCollection.find({}).limit(50).toArray();
    console.log(results);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
main().catch(console.error);

// temp
app.get("/", (req, res) => {
  res.send("Hello backend server");
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomDBItem(min, max){
   return const randomNum = Math.floor(Math.random() * (max - min + 1) + min);
}

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
