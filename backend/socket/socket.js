import { Server } from "socket.io";
import http from "http";
import express from "express";
import { refreshToken } from "../utils/generateToken.js";
import Livestream from "../models/Livestream.model.js";
import Session from "../models/Session.model.js";
import { ObjectId } from 'mongoose';

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
console.log(sessions,"sesh")
const userRooms = {};
// io.sockets.clients("Shamsia")
console.log(liveTime,"liveTime")

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);

  const req = socket.request;
  const res = socket.request.res;
  // refreshToken(req,res)

  socket.on("identify", (userId) => {
    console.log(`User ${userId} identified with socket ID ${socket.id}`);
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
      console.log(userId);
      if (!userRooms[roomName].includes(userId)) {
        userRooms[roomName].push(userId);
        console.log("hello");
        // Send updated list of users in the room to all clients in the room
        //Send live ID
        io.to(roomName).emit("roomUsers", userRooms[roomName]);
  if (liveTime[roomName]){
    console.log(liveTime,"live")
    socket.emit("live-status", { status: true, livestreamID: liveTime[roomName] });
    console.log(liveTime[roomName],"roomN")
  }     if (liveTime[roomName]){

        socket.emit("ongoing-sessions",sessions[roomName]);
        console.log(sessions[roomName],"SESSUON")
        }

      }
      console.log("hi", userRooms, liveTime);
    });

  socket.on("live", async (e) => {
    console.log(liveTime,"live")
    try {
      console.log(e,"WEEELIVE");
      let livestreamID;
      if (e.live === true) {
        const newStream = new Livestream();
        const savedStream = await newStream.save();
        
        livestreamID = savedStream._id; // Get the ID of the saved document
        liveTime[e.room] = livestreamID 
        console.log(savedStream);
        console.log(liveTime, livestreamID)
        if(livestreamID){

                io.to(e.room).emit("live-status", { status: true, livestreamID });
        }
      } else {
        const live = await Livestream.findById(e?.liveID);
        if (!live) {
          throw new Error('LiveStream not found');
        }    
        live.endedAt = Date.now()
        await live.save();
        console.log(live)
        delete liveTime[e.room] 
        console.log(liveTime[e.room])
        io.to(e.room).emit("live-status", { status: false,livestreamID: liveTime[e.room] });
      }
    } catch (error) {
      console.error("Error handling live event:", error);
      // Handle the error here
    }
  });
      
    
  socket.on("display-message", (e) => {
    socket.broadcast.to(e.room).emit("stream-message", e);
    console.log(e);
    //io.to("Shamsia").emit('stream-message', e);
  });

  // const userId = socket.handshake.query.userId;
  // io.emit() is used to send events to all the connected clients

  socket.on("paused-session",({ id,room       , pause })=>{
    console.log(pause)  
if(pause !== undefined && sessions[room]){
console.log(id,"traieler lory")
  const userSeshIndex = sessions[room].findIndex(s => s._id.toString() === id)
  sessions[room][userSeshIndex]= {...sessions[room][userSeshIndex], pause, pauseTime: Date.now()}
  console.log(pause)
  io.to(room).emit("paused-session", {id,pause})
}
})          

socket.on("reset-session",async({ id,room })=>{
   console.log(id)
if(sessions[room] && id){
  await Session.deleteOne({ _id : ObjectId(id) })
  const userSeshIndex = sessions[room].findIndex(s => s._id.toString() === id);
  console.log(userSeshIndex)
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
    console.log("rooms", socketRooms);

    socketRooms[socket.id]?.forEach((roomName) => {
      socket.leave(roomName);
      console.log("userId", socket.userId);
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
    console.log("ss", userRooms, socketRooms);
  });
});
export { app, io, server };
