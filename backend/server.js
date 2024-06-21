// const express = require("express");
import express from "express";
// import {createServer} from "http";
// import {Server} from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";

import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sleepRoutes from "./routes/sleepRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js"
import livestreamRoutes from "./routes/livestreamRoutes.js"

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
console.log("uri", process.env.MONGO_URI)
const connectToMongoDB = ()=> {
    
  mongoose.connect(
    process.env.MONGO_URI,       
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => {     
      console.log("Connected to MongoDB");
    }
  );
  mongoose.set("strictQuery", true)
}




app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/live", livestreamRoutes)
<<<<<<< HEAD
=======
app.post('/api/refreshToken', (req, res) => {
  try {
    
  //  const token = req.cookies.jwt;
    
    // if (!token) {
      
    //   return res.status(401).json({error: "Unauthorized - No Token Provided"});
    // }
    refreshToken(req,res)
    
    // Use the utility function
  //  res.json({ message:"successfult ref" });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// io.on("connection", (socket) => {
//   console.log("New user connected " + socket.id);

//   socket.on("join_room", (room) => {
//     console.log(room);
//     socket.join(room);
//     console.log("JOINDE ROOM");
//     socket.to(room).emit("receive_join_room", "hello");
//     // socket.join(room);
//     // io.emit("USER JOINED");
//   });
//   socket.on("send_message", (message) => {
//     console.log(message);
//     socket.broadcast.emit("receive_message", message);
//   });

//   socket.on("send-StartGoal", (message) => {
//     // socket.to(message.room).emit("receive-StartGoal", message); // Broadcast the message to all connected clients
//     // io.emit("send-StartGoal", message);
//     socket.broadcast.emit("receive_StartGoal", message);
//   });

//   socket.on("user_join", (message) => {
//     // socket.join(message.room);
//     socket.broadcast.emit("receive_user_join", message);

//     // socket.to(message.room).emit("user-join", message.info); // Broadcast the message to all connected clients
//   });
//   // io.socketsJoin("Shamsia");

//   // const sockets = async () => {
//   //   const s = await io.in("Shamsia").fetchSockets();
//   //   for (const socket of s) {
//   //     console.log(socket.rooms);
//   //   }
//   // };
//   // sockets();

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });
>>>>>>> 4881f169b34ebefabd6a9c5b8a0837801725b0f0

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});

