import Livestream from "../models/Livestream.model.js";
import {io} from "../socket/socket.js";

async function startNewStream(room, link) {
  const newStream = new Livestream({room: room, link});
  await newStream.save();
  io.to(room).emit("live-status", {status: true, newStream});
}

export const startLive = async (req, res) => {
  const {room, link} = req.body;
  console.log(room, " startLive");
  try {
    // Find the latest livestream in the room
    const livestream = await Livestream.findOne({room: room}).sort({
      createdAt: -1,
    });
    if (livestream && !livestream.endedAt) {
      // If the latest livestream has not ended, set its endedAt property
      livestream.endedAt = Date.now();

      await livestream.save();
    }
    await startNewStream(room, link);
  } catch (e) {
    console.log(e);
    res.status(500).json({message: "Error in starting Live"});
  }
};

export const checkStream = async (req, res) => {
  const {sentRoom: room} = req.body;

  try {
    const livestream = await Livestream.findOne({room: room}).sort({
      createdAt: -1,
    });

    
    if (livestream) {
      // If the latest livestream has not ended, set its endedAt property
      if (livestream.endedAt) {
        res.status(200).json({live: false});
      } else {
        res.status(200).json({live: true, link: livestream.link});
      }
    } else {
      res.status(200).json({live: false});
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({message: "Error in ending Live"});
  }
};

export const endLive = async (req, res) => {
  const {room, ranking} = req.body;
  try {
    const livestream = await Livestream.findOne({room: room}).sort({
      createdAt: -1,
    });
    if (livestream && !livestream.endedAt) {
      // If the latest livestream has not ended, set its endedAt property
      livestream.endedAt = Date.now();
      livestream.ranking = ranking;
      await livestream.save();
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({message: "Error in ending Live"});
  }
};
