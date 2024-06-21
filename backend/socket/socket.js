import { Server } from "socket.io";
import http from "http";
import express from "express";
import Session from "../models/Session.model.js";

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
let liveTime = {}
export const sessions = {}
const socketRooms = {};
const userRooms = {};
// io.sockets.clients("Shamsia")

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);

  const req = socket.request;
  const res = socket.request.res;
  // refreshToken(req,res)

  socket.on("identify", (userId) => {

    socket.join(userId);   
    socket.userId = userId;

    socketRooms[socket.id] = [];

  });
  
    socket.on("join-room", ({ userId, room: roomName }) => {
      socket.join(roomName);
      socketRooms[socket.id]?.push(roomName);
      if (!userRooms[roomName]) {
        userRooms[roomName] = [];  
      }

      if (!userRooms[roomName].includes(userId)) {
        userRooms[roomName].push(userId);
        // Send updated list of users in the room to all clients in the room
        //Send live ID
        io.to(roomName).emit("roomUsers", userRooms[roomName]);


  if (liveTime[roomName]){
    socket.emit("live-status", { status: true, livestreamID: liveTime[roomName] });
  }   
   

      }
    });

  socket.on("live", async (e) => {
    io.to(e.room).emit("live-status", { status: e.live});

   
  });
      
    
  socket.on("display-message", (e) => {
    socket.broadcast.to(e.room).emit("stream-message", e);
    console.log(e);
  });

  
  socket.on("paused-session",({ id,room       , pause })=>{
if(pause !== undefined && sessions[room]){
  const userSeshIndex = sessions[room].findIndex(s => s._id.toString() === id)
  sessions[room][userSeshIndex]= {...sessions[room][userSeshIndex], pause, pauseTime: Date.now()}
  io.to(room).emit("paused-session", {id,pause})
}
})          

socket.on("reset-session",async({ id,room })=>{
if(sessions[room] && id){
  await Session.deleteOne({ _id : ObjectId(id) })
  const userSeshIndex = sessions[room].findIndex(s => s._id.toString() === id);
  if (userSeshIndex !== -1) {
    sessions[room] = sessions[room].filter((s, index) => index !== userSeshIndex);
  }
io.to(room).emit("reset-session", {id})
}
})     


  socket.on("leave-room", ({ room: roomName, userId }) => {
    socket.leave(roomName);

    if (userRooms[roomName]) {
      const index = userRooms[roomName].indexOf(socket.userId);
      if (index !== -1) {
        userRooms[roomName].splice(index, 1);
        // Send updated list of users in the room to all clients in the room
        io.to(roomName).emit("roomUsers", userRooms[roomName]);
      }
    }
    console.log("leave", userRooms, socketRooms);
  });

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);

    socketRooms[socket.id]?.forEach((roomName) => {
      socket.leave(roomName);
      // Update userRooms object
      if (userRooms[roomName]) {
        const index = userRooms[roomName].indexOf(socket.userId);
        if (index !== -1) {
          userRooms[roomName].splice(index, 1);
          // Send updated list of users in the room to all clients in the room
          io.to(roomName).emit("roomUsers", userRooms[roomName]);
        }
      }
    });
    // Clean up socketRooms object
    delete socketRooms[socket.id];
    console.log("userRooms, socketRooms", userRooms, socketRooms);
  });
});
export { app, io, server };
