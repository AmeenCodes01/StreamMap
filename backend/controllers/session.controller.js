import Session from "../models/Session.model.js";
//need to have a session ID.
export const getSessions = async (req, res) => {
  try {
    const {userId: id} = req.body;
    console.log(id);
    const userSessions = await Session.find({
      userId: id,
    });
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
    res.status(201).json(newSession);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({error: "Internal server error"});
  }
};
