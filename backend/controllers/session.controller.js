import Session from "../models/Session.model.js";
//need to have a session ID.
import {io} from "../socket/socket.js";
import {sessions} from "../socket/socket.js";

const deleteIncompleteessions = async (res) => {
  try {
    // Find and delete all sessions where endedAt is either null, undefined, or doesn't exist
    const result = await Session.deleteMany({
      $or: [{endedAt: {$exists: false}}, {endedAt: null}],
    });

    console.log(`Deleted ${result.deletedCount} incomplete sessions`);

    res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} incomplete sessions`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting incomplete sessions:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

const getLatestSession = async (userId) => {
  try {
    const latestSession = await Session.findOne({userId}, null, {
      sort: {createdAt: -1},
    });
    return latestSession;
  } catch (e) {
    console.log(e, "error in getting latest session for checking");
  }
};

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

    res.status(200).json(userSessions);
  } catch (error) {
    console.error("Error in getUserSessions: ", error.message);
    res.status(500).json({error: "Internal  error"});
  }
};

export const startSession = async (req, res) => {
  try {
    const {session, name, live, userId} = req.body;
    session.status = "start";

    // get latest session & check if ended. only then, start new session. to fix spamming of start button starting multiple sessions.
    const lastSession = await getLatestSession(userId);
    console.log(lastSession, "lastSession");

    if (lastSession.endedAt) {
      // Create and save the session without the name
      const newSession = new Session(session);
      await newSession.save();

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
    } else {
      res.status(500).json({error: "previous session ongoing"});
    }
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
    console.log("Saved Session", session);
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
// when starting session, check if last session is rated.
// if not, ask for rating or don't remember. give it a rating of 4 by default then & start new.

export const checkSession = async (req, res) => {
  const {id} = req.body;
  console.log(id, "authID");
  try {
    const latestSession = await Session.findOne({userId: id}, null, {
      sort: {createdAt: -1},
    });
    //why not check here if session finished AND unrated and then send message accordingly ?
    const endTime = new Date(
      new Date(`${latestSession.createdAt}`) + latestSession.duration * 60000
    );
    const onGoing = new Date() < endTime;
    console.log(
      onGoing,
      "onGoing",
      endTime,
      latestSession.createdAt,
      "edde",
      new Date()
    );
    if (latestSession.rating) {
      res.status(201).json({message: "rated"});
    } else if (!latestSession.rating && !onGoing) {
      res
        .status(201)
        .json({message: "not rated", sessionID: latestSession._id});
    } else {
      res.status(201).json({message: "ongoing", sessionID: latestSession._id});
    }
  } catch (error) {
    res.status(500).json({error: "Session for checking rating not found"});
  }
};

export const rateSession = async (req, res) => {
  const {id: sessionID, rating} = req.body;
  const calculateSessionScore = (duration, rating) => {
    const durationWeight = 0.1;
    const ratingWeight = 0.5;

    const totalScore = duration * durationWeight + ratingWeight * rating;

    return Math.round(totalScore);
  };
  try {
    const session = await Session.findById(sessionID);
    session.rating = rating;
    session.score = calculateSessionScore(session.duration, rating);
    await session.save();

    res.status(201).json("rating saved");
  } catch (error) {
    res.status(500).json({error: "error in rating old session"});
  }
};
