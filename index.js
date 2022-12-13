const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require("mongodb").ObjectId;

const app = express();
dotenv.config()
app.use(cors());
app.use(express.json());
const port = process.env.VERCEL_PORT || 5000;

const uri = `mongodb+srv://${process.env.VERCEL_DB_USER}:${process.env.VERCEL_DB_PASS}@cluster0.muk27.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const runAPIs = async() => {
  try{
    await client.connect();
    const database = client.db('redux-emajon');
    const productsCollection = database.collection("products");

    app.get('/products/', async(req, res)=>{
      const result = await productsCollection.find({}).sort({_id:-1}).toArray();
      res.json(result);
    });
    app.get('/products/:id', async(req, res)=>{
      const query = {_id : objectId(req.params)};
      const result = await productsCollection.find(query);
      res.json(result);
    });

    // post new product
    app.post('/add_product', async(req, res)=>{
      const result = await productsCollection.insertOne(req.body);
      res.json(result);
    });

    // delete product
    app.delete('/delete_product/:id', async(req, res)=> {
      const query = {_id : objectId(req.params)};
      const resut = await productsCollection.deleteOne(query);
      res.json(resut);
    });

  }finally{

  }
}
runAPIs().catch(console.dir);

app.get('/', (req, res) => {
  res.send("This server is running!")
});

app.listen(port, ()=>{
  console.log('Server is Running!!');
});
