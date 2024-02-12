const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;
const {v4:uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer')
const peer = ExpressPeerServer(server , {
  debug:true
});
app.use('/peerjs', peer);
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/' , (req,res)=>{
  res.send(uuidv4());
});
app.get('/:room' , (req,res)=>{
    res.render('index' , {RoomId:req.params.room});
});
io.on("connection" , (socket)=>{
  socket.on('newUser' , (id , room)=>{
    socket.join(room);
    socket.to(room).broadcast.emit('userJoined' , id);
    socket.on('disconnect' , ()=>{
        socket.to(room).broadcast.emit('userDisconnect' , id);
    })
  })
})
server.listen(port , ()=>{
  console.log("Server running on port : " + port);
})


// // server.js
// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// app.use(express.static(__dirname + '/public'));

// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });

//     socket.on('offer', (offer) => {
//         socket.broadcast.emit('offer', offer);
//     });

//     socket.on('answer', (answer) => {
//         socket.broadcast.emit('answer', answer);
//     });

//     socket.on('icecandidate', (icecandidate) => {
//         socket.broadcast.emit('icecandidate', icecandidate);
//     });
// });

// server.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });
