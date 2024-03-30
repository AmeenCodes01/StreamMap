import Session from "../models/Session.model.js";
//need to have a session ID.
import { io } from "../socket/socket.js";

export const getSessions = async (req, res) => {
  try {
    const {room} = req.body;
    const userSessions = await Session.find(
      {
        // // userId: id,
        room: room, 
        // "createdAt": { "$gt": new Date(Date.now() - 24 * 60 * 60 * 1000)}
      }
    );
    res.status(201).json(userSessions);
  } catch (error) {
    console.error("Error in getUserSessions: ", error.message);
    res.status(500).json({error: "Internal  error"});
  }
};



export const getSessionByID = async (req, res) => {
  try {
    const id = req.user._id

    const userSessions = await Session.find(
      {
      userId: id,
    //  "createdAt": { "$gt": new Date(Date.now() - 24 * 60 * 60 * 1000)}
    }, 
    )
    
    res.status(200).json(userSessions);
  } catch (error) {
    console.error("Error in getUserSessions: ", error.message);
    res.status(500).json({error: "Internal  error"});
  }
};

export const saveSession = async (req, res) => {
  try {
    const {goal, duration, rating, room, sessionNumber} = req.body;
    const userId = req.user._id;
    const newSession = new Session({
      userId,
      goal,
      duration,
      rating,
      room,
      sessionNumber,
    });
    await newSession.save();
    io.to(room).emit("newSession", newSession )

    res.status(201).json(newSession);



  } catch (error) {
    console.log("Error in saveSession controller: ", error.message);
    res.status(500).json({error: "Internal server error"});
  }
};
