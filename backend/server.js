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
import countryRoutes from "./routes/countryRoutes.js";
dotenv.config();
app.use(
  cors({
    origin: "https://streammap-frontend.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const connectToMongoDB = () => {
  mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => {}
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
app.use("/api/country", countryRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  connectToMongoDB();
});
