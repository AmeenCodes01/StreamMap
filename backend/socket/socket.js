import { Server } from "socket.io";
import http from "http";
import express from "express";
import { refreshToken } from "../utils/generateToken.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const users = {};

//room Users
const userSocketMap = {}; // {userId: socketId}
let chatRoom = ""; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room
const socketRooms = {};

const userRooms = {};



// io.sockets.clients("Shamsia")

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);
   
  const req = socket.request;
  const res = socket.request.res;
 // refreshToken(req,res)




  socket.on('identify', userId => {
    console.log(`User ${userId} identified with socket ID ${socket.id}`);
    socket.join(userId);
    socket.userId = userId;

    socketRooms[socket.id] = [];

  });

  socket.on('display-message', (e) => {
    socket.broadcast.to(e.room).emit('stream-message', e  );
    console.log(e)
   //io.to("Shamsia").emit('stream-message', e);
  
  });

    // const userId = socket.handshake.query.userId;
  // io.emit() is used to send events to all the connected clients


  socket.on("join-room", ({userId, room:roomName}) => {
    
    socket.join(roomName);
    socketRooms[socket.id]?.push(roomName);

    if (!userRooms[roomName]) {
      userRooms[roomName] = [];
  }
  console.log(userId)
  if (!userRooms[roomName].includes(userId)) {
    userRooms[roomName].push(userId);
    console.log("hello")
    // Send updated list of users in the room to all clients in the room
    io.to(roomName).emit('roomUsers', userRooms[roomName]);
}
console.log("hi", userRooms, socketRooms)

  });

  socket.on("leave-room", ({ room:roomName, userId }) => {
	  
	

      socket.leave(roomName)

      if (userRooms[roomName]) {
        const index = userRooms[roomName].indexOf(socket.userId);
        if (index !== -1) {
            userRooms[roomName].splice(index, 1);
            // Send updated list of users in the room to all clients in the room
            io.to(roomName).emit('roomUsers', userRooms[roomName]);
        }
    }
    console.log("leave", userRooms, socketRooms)
	
  });

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
      console.log("rooms", socketRooms)

      socketRooms[socket.id]?.forEach(roomName => {
        socket.leave(roomName);
        console.log("userId", socket.userId)
        // Update userRooms object
        if (userRooms[roomName]) {
            const index = userRooms[roomName].indexOf(socket.userId);
            if (index !== -1) {
                userRooms[roomName].splice(index, 1);
                // Send updated list of users in the room to all clients in the room
                io.to(roomName).emit('roomUsers', userRooms[roomName]);
            }
        }
    });
    // Clean up socketRooms object
    delete socketRooms[socket.id];
    console.log("ss", userRooms, socketRooms)


  });
});
export { app, io, server };
