const express = require('express');
const path = require('path');

const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883

const { MongoClient } = require("mongodb");

// const friendsRouter = require('./routes/friends.router');
// const messagesRouter = require('./routes/messages.router');
// const dataRouter = require('./routes/data.router');

const app = express();

const PORT = 3000;

app.use((req, res, next) => {
  const start = Date.now();
  next();
  const delta = Date.now() - start;
  console.log(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`);
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('<p>some html</p>');
});
// app.use('/data', dataRouter);
// app.use('/friends', friendsRouter);
// app.use('/messages', messagesRouter);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});



// Attach the authentication handler to the Aedes instance
aedes.authenticate = (client, username, password, callback) => {
  // Replace this with your actual authentication mechanism
  // password = Buffer.from(password, 'base64').toString();
  console.log("authenticate id:", client.id, "user:", username);
  // console.log("authenticate password:", password); // spacing level = 2
  if (username === 'anusorn1998@gmail.com') {
    callback(null, true); // Successful authentication
  } else {
    callback(new Error('Authentication failed'), false);
  }
};


// Define your subscription authorization logic
// Attach the authorization handler to the Aedes instance
// aedes.authorizeSubscribe = (client, sub, callback) => {
//   // Replace this with your actual authorization mechanism
//   console.log("authorizeSubscribe" + client.username);
//   if (client.username === 'anusorn1998@gmail.com' && sub.topic.startsWith('1733696')) {
//     callback(null, true); // Allow subscription
//   } else {
//     callback(new Error('Unauthorized subscription'), false);
//   }
// };



aedes.on('client', function (client) {
  console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

aedes.on('publish', async function (packet, client) {
  console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)

  // console.log("publish:" + JSON.stringify(packet))
  // console.log("topic:" + JSON.stringify(packet.topic));
  // console.log("data:" + Buffer.from(packet.payload, 'base64').toString());

  // if(!packet.payload) return;
  if (packet.topic.includes('data')) {


    const uri = "mongodb://localhost:27017";
    // let payload;
    // try {
    //   payload = JSON.parse(Buffer.from(packet.payload, 'base64').toString());
    // } catch (e) {
    //   return; // Or whatever action you want here
    // }
    // console.log(payload);


    // mongoose.model('testmodel', blogSchema);

    // const doc = new Model();
    // await doc.save();

    const clientmongo = new MongoClient(uri);

    try {
      // Connect to the "insertDB" database and access its "haiku" collection
      const database = clientmongo.db("insertDB");
      const haiku = database.collection("haiku");
      const datapayload = JSON.parse(Buffer.from(packet.payload, 'base64').toString());
      // Create a document to insert
      // const doc = JSON.stringify(packet.payload);
      // const doc = Buffer.from(packet.payload).toString()

      console.log(JSON.stringify(packet.payload));

      // const doc = packet.payload.toString();
      console.log(typeof (datapayload));
      console.log(datapayload);
      // Insert the defined document into the "haiku" collection
      const result = await haiku.insertOne(datapayload);
      // Print the ID of the inserted document
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
      // Close the MongoDB client connection
      await clientmongo.close();
    }

  }
})



server.listen(port, function () {
  console.log('server started and listening on port ', port)
})

