const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    // await client.connect();
    const db = client.db("speedyToys");
    const toysCollection = db.collection("toys");
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.get("/alltoys", async (req, res) => {
      const result = await toysCollection.find({}).limit(20).toArray();
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const result = await toysCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/myToys/:email", async (req, res) => {
      const email = req.params.email;
      const result = await toysCollection
        .find({ sellerEmail: email })
        .toArray();
      console.log(email);
      res.send(result);
    });

    app.post("/addtoy", async (req, res) => {
      const body = req.body;
      const result = await toysCollection.insertOne(body);
      res.send(result);
      console.log(result);
    });

    // Delete Toy

    app.delete("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
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
