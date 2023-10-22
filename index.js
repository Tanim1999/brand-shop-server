const express= require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxdxtq4.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();
     
    const productCollection = client.db('productDB').collection('product')

    app.get('/product', async(req,res)=>{
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/product/:id',async(req,res)=>{
        const id= req.params.id;
        const query = {_id: new ObjectId(id)}
        const result =await productCollection.findOne(query);
        res.send(result);
    })

    app.put('/product/:id',async(req,res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        
        const options = {upsert: true};
        const updatedProduct = req.body ;
        const product = {
            $set : {
                image :updatedProduct.image,
                name :updatedProduct.name ,
                brandName :updatedProduct.brandName, 
                type :updatedProduct.type, 
                price :updatedProduct.price, 
                shortDescription :updatedProduct.shortDescription, 
                rating :updatedProduct.rating,
            }
        }

        const result = await productCollection.updateOne(filter,product,options)
        res.send(result)
    })

    app.post('/product',async(req,res)=>{
        const newProduct= req.body;
        console.log(newProduct)
        const result = await productCollection.insertOne(newProduct)
        res.send(result)
    })



const cartCollection = client.db('productDB').collection('cart');


app.post('/cart', async (req, res) => {
    const cartItem = req.body;
    const result = await cartCollection.insertOne(cartItem);
    res.send(result);
});


app.get('/cart/:userId', async (req, res) => {
    const userId = req.params.userId;
    const cursor = cartCollection.find({ userId: userId });
    const cartItems = await cursor.toArray();
    res.send(cartItems);
});








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('brand-shop-server is running')
})

app.listen(port,()=>{
    console.log(`brand server is running on port:${port}`)
})