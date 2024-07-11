import {Server} from "socket.io";
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
let liveTime = {};
export const sessions = {};
const socketRooms = {};
const userRooms = {};
// io.sockets.clients("Shamsia")
console.log(userRooms, "userRooms");
io.on("connection", async (socket) => {
  // console.log("a user connected", socket.id);

  // refreshToken(req,res)

  socket.on("identify", (userId) => {
    console.log("render");
    // Check if user is already connected
    console.log(userSocketMap, "userSocketMap");
    if (userSocketMap[userId]) {
      console.log(userSocketMap, "userSocketMap");

      // Disconnect the previous socket
      io.to(userSocketMap[userId]).emit(
        "forced_disconnect",
        "You've been logged in from another tab or browser. Refresh to join"
      );
      io.sockets.sockets.get(userSocketMap[userId])?.disconnect(true);
    }

    socket.join(userId);
    socket.userId = userId;
    userSocketMap[userId] = socket.id;
    socketRooms[socket.id] = null; // Initially not in any room

    // console.log(`User ${userId} identified with socket ${socket.id}`);
  });

  socket.on("join-room", ({room: roomName}) => {
    if (!socket.userId) {
      socket.emit("error", "User not identified");
      return;
    }

    console.log(`User ${socket.userId} joining room ${roomName}`);

    // If user is already in a room, make them leave it first
    if (socketRooms[socket.id]) {
      leaveRoom(socket, socketRooms[socket.id]);
    }

    socket.join(roomName);
    socketRooms[socket.id] = roomName;

    if (!userRooms[roomName]) {
      userRooms[roomName] = [];
    }

    if (!userRooms[roomName].includes(socket.userId)) {
      userRooms[roomName].push(socket.userId);
      io.to(roomName).emit("roomUsers", userRooms[roomName]);

      if (liveTime[roomName]) {
        socket.emit("live-status", {
          status: true,
          livestreamID: liveTime[roomName],
        });
      }
    }
  });

  socket.on("live", async (e) => {
    io.to(e.room).emit("live-status", {status: e.live, link: e.link});
  });

  socket.on("display-message", (e) => {
    socket.broadcast.to(e.room).emit("stream-message", e);
    console.log(e);
  });

  socket.on("paused-session", ({id, room, pause}) => {
    if (pause !== undefined && sessions[room]) {
      const userSeshIndex = sessions[room].findIndex(
        (s) => s._id.toString() === id
      );
      sessions[room][userSeshIndex] = {
        ...sessions[room][userSeshIndex],
        pause,
        pauseTime: Date.now(),
      };
      io.to(room).emit("paused-session", {id, pause});
    }
  });

  // socket.on("reset-session", async ({id, room}) => {
  //   if (sessions[room] && id) {
  //     //Object ID is making the issue here, check
  //     await Session.deleteOne({_id: id});
  //     const userSeshIndex = sessions[room].findIndex(
  //       (s) => s._id.toString() === id
  //     );
  //     if (userSeshIndex !== -1) {
  //       sessions[room] = sessions[room].filter(
  //         (s, index) => index !== userSeshIndex
  //       );
  //     }

  //     io.to(room).emit("reset-session", {id});
  //   }
  // });

  socket.on("leave-room", ({room: roomName}) => {
    leaveRoom(socket, roomName);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    if (socketRooms[socket.id]) {
      leaveRoom(socket, socketRooms[socket.id]);
    }

    if (socket.userId) {
      delete userSocketMap[socket.userId];
    }

    delete socketRooms[socket.id];
  });
});

export {app, io, server};

function leaveRoom(socket, roomName) {
  socket.leave(roomName);
  if (userRooms[roomName]) {
    const index = userRooms[roomName].indexOf(socket.userId);
    if (index !== -1) {
      userRooms[roomName].splice(index, 1);
      io.to(roomName).emit("roomUsers", userRooms[roomName]);
    }
    if (userRooms[roomName].length === 0) {
      delete userRooms[roomName];
    }
  }

  socketRooms[socket.id] = null;

  console.log(`User ${socket.userId} left room ${roomName}`);
}
