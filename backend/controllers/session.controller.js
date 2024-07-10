import Session from "../models/Session.model.js";
//need to have a session ID.
import {io} from "../socket/socket.js";
import {sessions} from "../socket/socket.js";

export const getSessions = async (req, res) => {
  try {
    const {room} = req.body;
    const userSessions = await Session.find({
      userId: id,
      room: room,
      createdAt: {$gt: new Date(Date.now - 24 * 60 * 60 * 1000)},
    });

    res.status(201).json(userSessions);
  } catch (error) {
    console.error("Error in getUserSessions: ", error.message);
    res.status(500).json({error: "Internal  error"});
  }
};

export const getSessionByID = async (req, res) => {
  try {
    const {id} = req.body;
    const userSessions = await Session.find({
      userId: id,
      //  "createdAt": { "$gt": new Date(Date.now - 24 * 60 * 60 * 1000)}
    });

    res.status(200).json(userSessions);
  } catch (error) {
    console.error("Error in getUserSessions: ", error.message);
    res.status(500).json({error: "Internal  error"});
  }
};

export const startSession = async (req, res) => {
  try {
    const {session,name,live} = req.body;
    const newSession = new Session(session);
    await newSession.save();

    console.log(newSession, "session start NEW");
    if (live) {
      console.log(live,"startSession Live")
      const room = session.room
      if (!sessions[room]) {
        sessions[room] = [];
      }
      console.log(name,"name")
      newSession.name = name
      // Check if the user already has a session in the room
      sessions[room].push(newSession.toObject());
      //if already exist, update duration,goal & status.   
      io.to(room).emit("start-sessions", newSession);
    }
    console.log(newSession, " start Session, socket io");
    res.status(201).json(newSession);
  } catch (error) {
    console.log("Error in saveSession controller: ", error.message);
    res.status(500).json({error: "Internal server error"});
  }
};

export const saveSession = async (req, res) => {
  try {
    const {
      goal,
      duration,
      rating,
      sessionNumber,
      mood,
      score,
      sessionID,
      room,
      timers,
      live,
    } = req.body;
    console.log(live, "session lives");
    // Find the session by ID
    console.log(sessionID, "SESSIONID  ");
    const session = await Session.findById(sessionID);
    if (!session) {
      console.log("No Session found for this ID");
      return res.status(404).json({error: "Session not found"});
    }

    // Update the session properties
    session.goal = goal;
    session.duration = duration;
    session.rating = rating;
    session.sessionNumber = sessionNumber;
    session.mood = mood;
    session.score = score;
    session.endedAt = Date.now();
    session.timers = timers;

    // Save the updated session
    await session.save();

    //Find the existing session in the sessions object
    if (live === "true") {
      const userSeshIndex = sessions[room].findIndex(
        (s) => s._id.toString() === sessionID
      );
      if (userSeshIndex !== -1) {
        sessions[room] = sessions[room].filter(
          (s, index) => index !== userSeshIndex
        );
      }

      // Emit the end-session event
      io.to(room).emit("end-sessions", session);
    }

    //console.log(sessions, "sessions obj");
    return res.status(201).json(session);
  } catch (error) {
    console.error("Error in saveSession controller: ", error.message);
    res.status(500).json({error: "Internal server error"});
  }
};
