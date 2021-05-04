const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let onlineUsers = 0

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });

    socket.on('get online users', () => {
        //Send over the onlineUsers
        socket.emit('get online users', onlineUsers);
    })

    socket.on('new user', () => {
        onlineUsers++
        console.log(onlineUsers)
        console.log(`✋ A new user has joined the chat! ✋`)
        io.emit('get online users', onlineUsers);
        io.emit('join/leave', 'user has joined the chat')
      })

      socket.on('disconnect', () => {
        onlineUsers--
        console.log(onlineUsers)
        console.log(`A user has left the chat`)
        io.emit('get online users', onlineUsers);
        io.emit('join/leave', 'user has left the chat')
    });

  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});