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

aedes.on('client', function (client) {
  console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

aedes.on('publish', async function (packet, client) {
  console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
})

server.listen(port, function () {
  console.log('server started and listening on port ', port)
})