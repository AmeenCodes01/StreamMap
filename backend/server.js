// const express = require("express");
import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// const http = require("http");

// const socketIo = require("socket.io");
// const cors = require("cors");
// const needle = require("needle");
const app = express();
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const authRoutes = require("./routes/authRoutes.js");
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
mongoose.connect(
  process.env.MONGO_URI,
  {useNewUrlParser: true, useUnifiedTopology: true},
  () => {
    console.log("Connected to MongoDB");
  }
);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
  },
});
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3001",
//   },
// });
const sockets = async () => {
  const s = await io.fetchSockets();
  console.log(s);
};

// for (const socket of sockets) {
//   // console.log(socket.id);
//   // console.log(socket.handshake);
//   console.log(socket.rooms);
//   // console.log(socket.data);
//   // socket.emit(/* ... */);
//   // socket.join(/* ... */);
//   // socket.leave(/* ... */);
//   // socket.disconnect(/* ... */);
// }

app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/users", userRoutes);

io.on("connection", (socket) => {
  console.log("New user connected " + socket.id);

  socket.on("join_room", (room) => {
    console.log(room);
    socket.join(room);
    console.log("JOINDE ROOM");
    socket.to(room).emit("receive_join_room", "hello");
    // socket.join(room);
    // io.emit("USER JOINED");
  });
  socket.on("send_message", (message) => {
    console.log(message);
    socket.broadcast.emit("receive_message", message);
  });

  socket.on("send-StartGoal", (message) => {
    // socket.to(message.room).emit("receive-StartGoal", message); // Broadcast the message to all connected clients
    // io.emit("send-StartGoal", message);
    socket.broadcast.emit("receive_StartGoal", message);
  });

  socket.on("user_join", (message) => {
    // socket.join(message.room);
    socket.broadcast.emit("receive_user_join", message);

    // socket.to(message.room).emit("user-join", message.info); // Broadcast the message to all connected clients
  });
  // io.socketsJoin("Shamsia");

  // const sockets = async () => {
  //   const s = await io.in("Shamsia").fetchSockets();
  //   for (const socket of s) {
  //     console.log(socket.rooms);
  //   }
  // };
  // sockets();

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// io.on("connection", (socket) => {
//   console.log(`connected ${socket.id} `);
//   socket.on("join", ({room, username}) => {
//     console.log(room, username);

//     //if username == Shams{pass}, join her to her room with username as plain Shamsia or SunStar. her user info will be available by context api to all props. leave a shams state as boolean in context to help identify.
//     // socket.broa.emit("send-message", socket.id);
//   });

//   socket.on("nextStreamFive", (i) => {
//     console.log(i);
//     io.emit(i);
//   });
// });
