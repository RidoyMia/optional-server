const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 8000
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.PRIVATE_KEY}:${process.env.PRIVET_USER}@cluster0.xawyq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const foodCollection = client.db('Food').collection('all');
const OrderCollection = client.db('Food').collection('order');
const UserCollection = client.db('Food').collection('user');
async function run(){
  try{
    await client.connect();
    app.get('/services',async(req,res)=>{
      const query = {};
      const cursor = foodCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    })
   
//

    app.put('/order/:name',async(req,res)=>{
      const name = req.params.name;
      const booking = req.body;
      
      const filter = {name : name, email : booking?.email}
      const movie = await OrderCollection .findOne(filter);
      const options = { upsert: true };
    
      if(movie?.quantity){
       const  updateDoc = {
          $set: {
            userName : booking.userName,
            email : booking.email,
            name : booking.name,
            quantity : movie?.quantity + booking.quantity,
            per_price : booking.per_price,
            
          },
        };
        const result = await OrderCollection.updateOne(filter, updateDoc,options);
        res.send(result)

  
      }
      else{
       const updateDoc = {
          $set: {
            userName : booking.userName,
            email : booking.email,
            name : booking.name,
            quantity : booking.quantity,
            per_price : booking.per_price,
            
          },
        };
        const ami = await OrderCollection.updateOne(filter, updateDoc,options);
        res.send(ami)

      }
      
     
    })



    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      
      const query = { _id :id };
      const service = await foodCollection.findOne(query);
      res.send(service);
  });
  app.post('/users',async(req,res)=>{
    const user = req.body;
    console.log(user)
    const movie = await UserCollection.findOne(user);
    if(movie){
      res.send('false')
    }
    else{
      const result = await UserCollection.insertOne(user);
      res.send(result)
    }
  })
  }
  finally{

  }
}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello 9000t World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})