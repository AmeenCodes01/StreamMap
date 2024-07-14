import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import {fileURLToPath} from "url";
import {app, server} from "./socket/socket.js";

import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sleepRoutes from "./routes/sleepRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import livestreamRoutes from "./routes/livestreamRoutes.js";
import promisesRoutes from "./routes/promisesRoutes.js";
import countryRoutes from "./routes/countryRoutes.js";
import config from "./config.js";

dotenv.config();

app.use(
  cors({
    origin: config.FRONTEND_URL,
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

// Serve static files from the React app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../client/build")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});
