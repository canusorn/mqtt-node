const express = require('express');
const path = require('path');

const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883

const friendsRouter = require('./routes/friends.router');
const messagesRouter = require('./routes/messages.router');

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
app.use('/friends', friendsRouter);
app.use('/messages', messagesRouter);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});




const authenticate = (client, username, password, callback) => {
  // Replace this with your actual authentication mechanism
  password = Buffer.from(password, 'base64').toString();
  console.log("authenticate id:",client.id,"user:",username);
  console.log("authenticate password:", password); // spacing level = 2
  if (username === 'testuser' && password === 'key') {
    callback(null, true); // Successful authentication
  } else {
    callback(new Error('Authentication failed'), false);
  }
};


// Attach the authentication handler to the Aedes instance
aedes.authenticate = authenticate;

// Define your subscription authorization logic
const authorizeSubscribe = (client, sub, callback) => {
  // Replace this with your actual authorization mechanism
  console.log("authorizeSubscribe" + client.username);
  if (client.username === 'testuser' && sub.topic.startsWith('@test')) {
    callback(null, true); // Allow subscription
  } else {
    callback(new Error('Unauthorized subscription'), false);
  }
};

// Attach the authorization handler to the Aedes instance
// aedes.authorizeSubscribe = authorizeSubscribe;


aedes.on('client', function (client) {
  console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

aedes.on('publish', async function (packet, client) {
  console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
})

server.listen(port, function () {
  console.log('server started and listening on port ', port)
})