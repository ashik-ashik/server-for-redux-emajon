const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require("mongodb").ObjectId;

const app = express();
dotenv.config()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.muk27.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const runAPIs = async() => {
  try{
    await client.connect();
    const database = client.db('redux-emajon');
    const productsCollection = database.collection("products");

    app.get('/products', async(req, res)=>{
      const result = await productsCollection.find({}).toArray();
      res.json(result);
    })

  }finally{

  }
}
runAPIs().catch(console.dir);

app.get('/', (req, res) => {
  res.send("This server is running!")
});

app.listen(port, ()=>{
  console.log('Server is Running!!');
})