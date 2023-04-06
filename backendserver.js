//login details
const user = process.env.USERNAME;
const pswrd = process.env.PASSWORD;

const express = require("express");
const path = require("path");
const app = express();
const PORT = 3001;
const uri = "mongodb+srv://${user}:<${pswrd}>@cluster0.zpcyqgd.mongodb.net/test"; //need safer way to store password, maybe enviornment or something

//setup connection to mongodb
const { MongoClient} = require('mongodb');

async function main(){
  const client = new MongoClient(uri);
  try {
    await client.connect();
    await db_items(client);
  } catch(e){
    console.error(e);
  } finally {
    await client.close();
  }
main.catch(console.error);
}





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
