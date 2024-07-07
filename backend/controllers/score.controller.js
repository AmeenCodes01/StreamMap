import User from "../models/User.js";
import Session from "../models/Session.model.js";
import Livestream from "../models/Livestream.model.js";
import {sessions} from "../socket/socket.js";

//Promises should not be inside a room right ?
//but invidual room points ? later

export const getTotalScore = async (req, res) => {
  try {
    const {id} = req.body;
    console.log(id, "idTotalScore");
    const user = await User.findById(id)
    console.log
    res.status(200).json(user.currentScore);

    console.log(user, "scores");
  } catch (error) {
    res.status(500).json({error: "Internal  error"});

    console.error("Error getting Total Score:", error);
  }
};

export const updateScore = async (req, res) => {
  const {score: newScore, room, authId: userId} = req.body;
  console.log(userId, "user id ");

  try {
    // Find the user document by userId
    const user = await User.findById(userId);

    let s;
    // Check if the user exists
    if (!user) {
      throw new Error("User not found");
    }

    // Find the score with the given room or create a new one if it doesn't exist
    const scoreIndex = user.scores.findIndex((score) => score.room === room);
    if (scoreIndex !== -1) {
      // Update the existing score

      user.scores[scoreIndex].score += newScore;
      s = user.scores[scoreIndex].score += newScore;
    } else {
      // Create a new score entry
      user.scores.push({room, score: newScore});
      s = newScore;
    }
    const total = user.scores.reduce(
      (partialSum, a) => partialSum + a.score,
      0
    );
    user.currentScore = total
    // Save the updated user document
    await user.save();
    res.status(200).json(`Score for room ${room} updated to ${s}`);

    console.log(`Score for room ${room} updated to ${newScore}`);
  } catch (error) {
    res.status(500).json({error: "Internal  error"});

    console.error("Error saving new score:", error);
  }
};

export const getRanking = async (req, res) => {
  const {room} = req.body;
  try {
    // Aggregate pipeline to filter scores for the specified room, sum scores, and sort by score descending
    const pipeline = [
      {$match: {"scores.room": room}}, // Match documents with scores for the specified room
      {$unwind: "$scores"}, // Split scores array into separate documents
      {$match: {"scores.room": room}}, // Match documents with scores for the specified room again
      {$group: {_id: "$_id", totalScore: {$sum: "$scores.score"}}}, // Group by user ID and sum scores
      {$sort: {totalScore: -1}}, // Sort by total score descending
      {$limit: 15}, // Limit to top 15 users
    ];

    const pipe = [
      {$match: {room: room}},
      {$group: {_id: "$userId", totalTime: {$sum: "$duration"}}}, // Group by null (all documents) and sum durations
    ];

    // Execute the aggregation query
    const totalDuration = await Session.aggregate(pipe);

    // Return the total duration (if available, otherwise return 0)
    // Execute the aggregation query
    const topUsers = await User.aggregate(pipeline);

    const combinedArray = topUsers
      .map((user) => {
        const durationEntry = totalDuration.find((entry) =>
          entry._id.equals(user._id)
        );
        if (durationEntry) {
          return {
            userId: user._id,
            totalScore: user.totalScore,
            totalDuration: durationEntry.totalTime,
          };
        }
        return null; // Return null for users without matching duration entry
      })
      .filter((entry) => entry !== null); // Remove null entries from the array

    res.status(200).json(combinedArray);
    return topUsers;
  } catch (error) {
    console.error("Error getting top users:", error);
    res.status(500).json({error: "Internal  error"});

    throw error;
  }
};

export const getLiveRanking = async (req, res) => {
  let {room} = req.body;

  const live = await Livestream.findOne({room: room}).sort({createdAt: -1}); // Ensure to await the result
  if (!live) {
    //return no livestream.
    throw new Error("no livestream");
  }

  const livestreamStartTime = live.createdAt;
  try {
    // Aggregate pipeline to filter sessions since livestream start time
    const pipeline = [
      {
        $match: {
          createdAt: {$gte: livestreamStartTime},
          room: room,
        },
      },
      {
        $group: {
          _id: "$userId",
          totalScore: {$sum: "$score"},
          totalDuration: {$sum: "$duration"},
        },
      },
      {
        $project: {
          userId: "$_id",
          totalScore: 1,
          totalDuration: 1,
          _id: 0, // Exclude the original _id field
        },
      },
      {$sort: {totalScore: -1}},
    ];

    // Execute the aggregation query
    const userSessions = await Session.aggregate(pipeline);

    if (sessions[room]) {
      for (let sesh of sessions[room]) {
        // Check if the session already exists in userSessions
        let existingSessionIndex = userSessions.findIndex(
          (session) => session.userId.toString() === sesh.userId.toString()
        );
        // If it exists, update the existing session
        if (existingSessionIndex !== -1) {
          userSessions[existingSessionIndex] = {
            ...userSessions[existingSessionIndex],
            ...sesh,
          };
        } else {
          // If it doesn't exist, add the new session
          userSessions.push(sesh);
        }
      }
    }

    console.log(userSessions, "userSessions");
    res.status(200).json(userSessions);
    //cant we try to merge the sessions in here ? same logic as front end.
    //so I have to pull in sessions object.
    // userSessions.forEach((sesh) => {
    //   // Find the session in liveRanking
    //   let session = sessions.find((session) => session.userId === sesh.userId);

    //   if (session) {
    //     // If the session exists in liveRanking, update it
    //     session.totalScore = (session.totalScore || 0) + sesh.score;
    //     session.totalDuration = (session.totalDuration || 0) + sesh.duration;
    //     session.rating = sesh.rating;
    //   } else {
    //     // If the session doesn't exist in liveRanking, add it
    //     sessions.push(sesh);
    //   }
    // });

    // Sort the liveRanking array by score in descending order
    userSessions.sort((a, b) => (b.score || 0) - (a.score || 0));
    //return userSessions;
  } catch (error) {
    console.error("Error getting sessions since livestream start:", error);
    throw error;
  }
};
