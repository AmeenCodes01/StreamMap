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
    const user = await User.findById(id);
    console.log;
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
    user.currentScore = total;
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
  try {
    let {room} = req.body;

    const live = await Livestream.findOne({room: room}).sort({createdAt: -1});
    if (!live) {
      return res.status(404).json({error: "No livestream found"});
    }

    const livestreamStartTime = live.createdAt;

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: livestreamStartTime },
          // room: room,
        },
      },
      {
        $sort: { createdAt: -1 }  // Sort by createdAt in descending order
      },
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: { $ifNull: ["$score", 0] } },
          totalDuration: { $sum: { $ifNull: ["$duration", 0] } },
          latestSession: { $first: "$$ROOT" },
          ratings: {
            $push: {
              $cond: {
                if: { $ne: ["$rating", null] },
                then: {
                  rating: "$rating",
                  createdAt: "$createdAt"
                },
                else: "$$REMOVE",
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          userId: "$_id",
          totalScore: 1,
          totalDuration: 1,
          status: "$latestSession.status",
          _id: "$latestSession._id",
          name: "$user.name",
          ratings: {
            $sortArray: {
              input: "$ratings",
              sortBy: { createdAt: -1 }
            }
          },
        },
      },
      {
        $project: {
          userId: 1,
          totalScore: 1,
          totalDuration: 1,
          status: 1,
          _id: 1,
          name: 1,
          ratings: "$ratings.rating",
        }
      },
      { $sort: { totalScore: -1 } },
    ];

    let userSessions = await Session.aggregate(pipeline);

    console.log(userSessions, "userSessions");

    // Merge with in-memory sessions
    // if (sessions[room]) {
    //   const memorySessionMap = new Map(
    //     sessions[room].map((s) => [s.userId.toString(), s])
    //   );

    //   userSessions = userSessions.map((dbSession) => {
    //     const memorySession = memorySessionMap.get(dbSession.userId.toString());
    //     if (memorySession) {
    //       // Check if the memory session is newer than the latest DB session
    //       const isMemorySessionNewer =
    //         memorySession._id.toString() !== dbSession._id.toString();
    //       return {
    //         ...dbSession,
    //         status: memorySession.status,
    //         totalScore: isMemorySessionNewer
    //           ? dbSession.totalScore + (memorySession.score || 0)
    //           : dbSession.totalScore,
    //         totalDuration: isMemorySessionNewer
    //           ? dbSession.totalDuration + (memorySession.duration || 0)
    //           : dbSession.totalDuration,
    //         _id: memorySession._id, // Use the latest session ID
    //         ratings: [
    //           ...dbSession.ratings,
    //           ...(isMemorySessionNewer &&
    //           memorySession.rating !== null &&
    //           memorySession.rating !== undefined
    //             ? [memorySession.rating]
    //             : []),
    //         ],
    //       };
    //     }
    //     return dbSession;
    //   });

    //   // Add any users that are only in memory
    //   for (const memorySession of sessions[room]) {
    //     if (
    //       !userSessions.some(
    //         (s) => s.userId.toString() === memorySession.userId.toString()
    //       )
    //     ) {
    //       const user = await User.findById(memorySession.userId);
    //       userSessions.push({
    //         userId: memorySession.userId,
    //         totalScore: memorySession.score || 0,
    //         totalDuration: memorySession.duration || 0,
    //         status: memorySession.status,
    //         _id: memorySession._id,
    //         name: user ? user.name : "Unknown User",
    //         ratings:
    //           memorySession.rating !== null &&
    //           memorySession.rating !== undefined
    //             ? [memorySession.rating]
    //             : [],
    //       });
    //     }
    //   }
    // }

    // Re-sort after merging
    userSessions.sort((a, b) => b.totalScore - a.totalScore);

    console.log("Final userSessions:", userSessions);
    res.status(200).json(userSessions);
  } catch (error) {
    console.error("Error getting sessions since livestream start:", error);
    res.status(500).json({error: "Internal server error"});
  }
};
