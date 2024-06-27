// const express = require("express");
import express from "express";
// import {createServer} from "http";
// import {Server} from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {app, server} from "./socket/socket.js";

import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sleepRoutes from "./routes/sleepRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import livestreamRoutes from "./routes/livestreamRoutes.js";
import promisesRoutes from "./routes/promisesRoutes.js";
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
console.log("uri", process.env.MONGO_URI);
const connectToMongoDB = () => {
  mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => {
      console.log("Connected to MongoDB");
    }
  );
  mongoose.set("strictQuery", true);
};

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/live", livestreamRoutes);
app.use("/api/promise", promisesRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
