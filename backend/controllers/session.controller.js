import Session from "../models/Session.model.js";
//need to have a session ID.
import {io} from "../socket/socket.js";
import {sessions} from "../socket/socket.js";

// export const deleteIncompleteessions = async (res) => {
//   try {
//     // Find and delete all sessions where endedAt is either null, undefined, or doesn't exist
//     const result = await Session.deleteMany({
//       $or: [{endedAt: {$exists: false}}, {endedAt: null}],
//     });

//     console.log(`Deleted ${result.deletedCount} incomplete sessions`);

//     res.status(200).json({
//       message: `Successfully deleted ${result.deletedCount} incomplete sessions`,
//       deletedCount: result.deletedCount,
//     });
//   } catch (error) {
//     console.error("Error deleting incomplete sessions:", error);
//     res.status(500).json({error: "Internal server error"});
//   }
// };

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
    console.log("im in", id);
    const userSessions = await Session.find({
      userId: id,
      createdAt: {$gt: new Date(Date.now() - 24 * 60 * 60 * 1000)},
    });
    console.log(userSessions, "user");
    res.status(200).json(userSessions);
  } catch (error) {
    console.error("Error in getUserSessions: ", error.message);
    res.status(500).json({error: "Internal  error"});
  }
};

export const startSession = async (req, res) => {
  try {
    const {session, name, live} = req.body;
    session.status = "start";
    // Create and save the session without the name
    const newSession = new Session(session);
    await newSession.save();
    //deleteIncompleteessions();
    if (live) {
      const room = session.room;
      if (!sessions[room]) {
        sessions[room] = [];
      }

      // Create a new object with session data and name for the live sessions array
      const sessionWithName = {
        ...newSession.toObject(),
        name,
      };

      sessions[room].push(sessionWithName);
      console.log(sessionWithName, "name");
      // Emit the session with name for live updates
      io.to(room).emit("start-sessions", sessionWithName);
    }

    // Send the response without the name
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

    console.log(live, "session lives IN SAVECONTORLLER  ");
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
    session.status = "end";

    // Save the updated session
    await session.save();

    //Find the existing session in the sessions object
    if (live) {
      const userSeshIndex = sessions[room]?.findIndex(
        (s) => s._id.toString() === sessionID
      );
      if (userSeshIndex !== -1 && sessions[room]) {
        sessions[room] = sessions[room]?.filter(
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

export const resetSession = async (req, res) => {
  try {
    const {id, room, live} = req.body;
    console.log(id, room, live, "resetSession");
    await Session.deleteOne({_id: id});
    // Create and save the session without the name

    if (live) {
      //Object ID is making the issue here, check
      const userSeshIndex = sessions[room]?.findIndex(
        (s) => s._id.toString() === id
      );
      if (userSeshIndex !== -1) {
        sessions[room] = sessions[room]?.filter(
          (s, index) => index !== userSeshIndex
        );
      }

      io.to(room).emit("reset-session", {id});
    }
    res.status(201).json("successfly reset");
  } catch (error) {
    console.log("Error in resetSession controller: ", error.message);
    res.status(500).json({error: "Internal server error"});
  }
};
