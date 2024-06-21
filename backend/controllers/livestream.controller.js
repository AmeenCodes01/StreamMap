import Livestream from "../models/Livestream.model.js";
import { io } from "../socket/socket.js";

async function startNewStream(room) {
  const newStream = new Livestream({ room: room /* other properties */ });
  await newStream.save();
  console.log(newStream, "Started newStream");
  io.to(room).emit("live-status", { status: true, newStream });
}
   
export const startLive = async (req, res) => {
  const { room } = req.body;
  console.log(room," startLive");
  try {
    // Find the latest livestream in the room  
    const livestream = await Livestream.findOne({ room: room }).sort({ createdAt: -1 });
    if (livestream && !livestream.endedAt) {
      // If the latest livestream has not ended, set its endedAt property
      livestream.endedAt = Date.now();
      await livestream.save();
    }
   await startNewStream(room);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error in starting Live" });
  }
};

export const checkStream = async (req, res) => {
  const { sentRoom:room } = req.body;
  console.log(room,"checkRoom")

  try {
    const livestream = await Livestream.findOne({ room: room }).sort({ createdAt: -1 });

    console.log("live stream for check", livestream, livestream && livestream.endedAt)
    if (livestream && livestream.endedAt) {
      // If the latest livestream has not ended, set its endedAt property
      res.status(200).json({ live: false });
    } else {
      res.status(200).json({ live: true });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error in ending Live" });
  }
};



export const endLive = async (req, res) => {
  const { room } = req.body;

  try {
    const livestream = await Livestream.findOne({ room: room }).sort({
      createdAt: -1,
    });
    if (livestream && !livestream.endedAt) {
      // If the latest livestream has not ended, set its endedAt property
      livestream.endedAt = Date.now();
      await livestream.save();
    }
    console.log(livestream)
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error in ending Live" });
  }
};
