import {Server} from "socket.io";
import http from "http";
import express from "express";
import config from "../config.js";
import Session from "../models/Session.model.js";
const app = express();
console.log(config);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

//room Users
const userSocketMap = {}; // {userId: socketId}
const displayMessage = {};
export const sessions = {};
const socketRooms = {};
const userRooms = {};
console.log(userRooms, "userRooms");
io.on("connection", async (socket) => {
  // console.log("a user connected", socket.id);

  socket.on("identify", (userId) => {
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
      console.log(displayMessage, "displayMessage");
      if (displayMessage[roomName]) {
        socket.emit("stream-message", displayMessage[roomName]);
      }
    }
  });

  socket.on("live", async (e) => {
    io.to(e.room).emit("live-status", {status: e.live, link: e.link});
  });

  socket.on("display-message", (e) => {
    socket.broadcast.to(e.room).emit("stream-message", e);
    console.log(e);
    displayMessage[e.room] = e;
  });

  socket.on("paused-session", async ({id, room, pause}) => {
    console.log(id, room, pause, "socket PAUSED");
    if (pause !== undefined && sessions[room]) {
      try {
        const sesh = await Session.findByIdAndUpdate(
          id,
          {status: pause ? "pause" : "start"},
          {new: true}
        );

        console.log(sesh, "SESH SAVE");

        const userSeshIndex = sessions[room].findIndex(
          (s) => s._id.toString() === id
        );

        if (userSeshIndex !== -1) {
          sessions[room][userSeshIndex] = {
            ...sessions[room][userSeshIndex],
            status: pause ? "pause" : "start",
          };
        }

        io.to(room).emit("paused-session", {id, pause});
      } catch (error) {
        console.error("Error updating session status:", error);
      }
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
