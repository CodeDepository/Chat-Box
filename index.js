const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

// communication
const users = {};

io.on('connection', (socket) => {
  socket.on('setName', (name) => {
    users[socket.id] = name;
  });

  socket.on('message', (msg) => {
    const name = users[socket.id] || socket.id.slice(0, 4);
    io.emit('message', `<strong>${name}:</strong> ${msg}`);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
  });
});


// Start server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
