const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'https://codedepository.github.io',
  methods: ['GET', 'POST'],
}));

const io = new Server(server, {
  cors: {
    origin: 'https://codedepository.github.io',
    methods: ['GET', 'POST'],
  }
});

const users = {};

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('setName', (name) => {
    users[socket.id] = name;
  });

  socket.on('message', (msg) => {
    const name = users[socket.id] || socket.id.slice(0, 4);
    io.emit('message', `<strong>${name}:</strong> ${msg}`);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    console.log('Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
