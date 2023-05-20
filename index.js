const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtwk5ft.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("speedyToys");
    const toysCollection = db.collection("toys");
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    app.post("/addToy", async (req, res) => {
      const body = await req.body;
      const result = await toysCollection.insertOne(body);
      if (!body) {
        return res.status(403).send({ message: "body data not found" });
      }
      res.send(result);
      console.log(result);
    });

    app.get("/alltoys", async (req, res) => {
      const result = await toysCollection.find({}).toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("speedy toys are running........");
});
app.listen(port, () => {
  console.log(`speedy toys are running on port ${port}`);
});
