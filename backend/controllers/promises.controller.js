// import Promise from "../models/Promises.model.js";

// export const getPromises = async (req, res) => {
//   try {
//     const {id: userId} = req.body;
//     console.log(userId, "promises");
//     const userPromises = await Promise.find({userId});

//     console.log(userPromises, "promises");
//     res.status(200).json(userPromises);
//   } catch (error) {
//     res.status(500).json({error: "Internal error"});
//     console.error("Error getting Promises:", error);
//   }
// };

// export const newPromise = async (req, res) => {
//   try {
//     const {id: userId, promise, coins:score, room} = req.body;
//     console.log(promise, coins, "promises");

//     const newPromise = new Promise({
//       userId,

//       promise,
//       coins: []
//     });
//     newPromise.push({score,room })
//     await newPromise.save();
//     console.log(newPromise, "new Promise");
//     res.status(200).json(newPromise);
//   } catch (error) {
//     res.status(500).json({error: "Internal error"});
//     console.error("Error getting Promises:", error);
//   }
// };

// //edit title
// export const editPromise = async (req, res) => {
//   try {
//     const {id, promise} = req.body;
//     //here id is _id of the promise

//     const currentPromise = await Promise.findById(id);
//     console.log(promise);
//     currentPromise.promise = promise;
//     await currentPromise.save();

//     res.status(200).json(currentPromise);
//   } catch (error) {
//     res.status(500).json({error: "Internal error"});
//     console.error("Error editing Promises:", error);
//   }
// };

// //del promise
// export const deletePromise = async (req, res) => {
//   try {
//     const {id} = req.body;
//     // Here id is the _id of the promise

//     const deletedPromise = await Promise.findByIdAndDelete(id);
//     // The promise with the specified id has been deleted

//     res.status(200).json(deletedPromise);
//   } catch (error) {
//     res.status(500).json({error: "Internal error"});
//     console.error("Error deleting Promise:", error);
//   }
// };

// // increase coins
// export const updatePromise = async (req, res) => {
//   try {
//     const { id, coins, room } = req.body;

//     const currentPromise = await Promise.findById(id);

//     const existingCoin = currentPromise.coins.find((coin) => coin.room === room);

//     if (existingCoin) {
//       existingCoin.score += coins;
//     } else {
//       currentPromise.coins.push({ score: coins, room });
//     }
//     await currentPromise.save();

//     res.status(200).json(currentPromise);
//   } catch (error) {
//     res.status(500).json({ error: "Internal error" });
//     console.error("Error updating Promise coins:", error);
//   }
// };

// export const getRoomDonation = async  (req,res) =>{
// try{
// //call this on Rooms page & display there.
// const result = await Promise.aggregate([
//   { $unwind: "$coins" },
//   {
//     $group: {
//       _id: "$coins.room",
//       totalScore: { $sum: "$coins.score" },
//     },
//   },
// ]);

// // Extract the room-wise total scores
// const roomScores = result.map((item) => ({
//   room: item._id,
//   totalScore: item.totalScore,
// }));

// console.log("Room-wise Total Scores:", roomScores);
// }catch(error){
//   res.status(500).json({ error: "Internal error" });
//   console.error("Error in getting room donation", error);
// }
// }


// export const getTotalDonation = async (req,res) =>{
//   try{

//     const result = await Promise.aggregate([
//       { $match: { promise: "Donate to Palestine" } },
//       { $unwind: "$coins" },
//       {
//         $group: {
//           _id: null,
//           totalScores: { $sum: "$coins.score" },
//         },
//       },
//     ]);
    
//     // Extract the total scores
//     const totalScores = result[0]?.totalScores || 0;
//     console.log("Total Scores:", totalScores);
//   }catch (error) {
//     res.status(500).json({ error: "Internal error" });
//     console.error("Error getting total donation", error);
//   }

// }

import Promise from "../models/Promises.model.js";
import User from "../models/User.js";

export const getPromises = async (req, res) => {
  try {
    const {id: userId} = req.body;
    console.log(userId, "promises");
    const userPromises = await Promise.find({userId});    

    console.log(userPromises, "promises");
    res.status(200).json(userPromises);
  } catch (error) {
    res.status(500).json({error: "Internal error"});
    console.error("Error getting Promises:", error);
  }
};
//remove from user scores. but score of which room ? he needs 2 right, one record, one current(for shopping)
export const newPromise = async (req, res) => {
  try {
    const {id: userId, promise, coins} = req.body;
    console.log(promise, coins, "promises");

    const newPromise = new Promise({
      userId,

      promise,
      coins,
    });
    await newPromise.save();


if (coins > 0){

  const user = await User.findById(userId)
  user.currentScore -= coins
    await user.save()
}


    console.log(newPromise, "new Promise");
    res.status(200).json(newPromise);
  } catch (error) {
    res.status(500).json({error: "Internal error"});
    console.error("Error getting Promises:", error);
  }
};

//edit title
export const editPromise = async (req, res) => {
  try {
    const {id, promise} = req.body;
    //here id is _id of the promise

    const currentPromise = await Promise.findById(id);
    console.log(promise);
    currentPromise.promise = promise;
    await currentPromise.save();

    res.status(200).json(currentPromise);
  } catch (error) {
    res.status(500).json({error: "Internal error"});
    console.error("Error editing Promises:", error);
  }
};

//del promise
export const deletePromise = async (req, res) => {
  try {
    const {id} = req.body;
    // Here id is the _id of the promise

    const deletedPromise = await Promise.findByIdAndDelete(id);
    // The promise with the specified id has been deleted

    res.status(200).json(deletedPromise);
  } catch (error) {
    res.status(500).json({error: "Internal error"});
    console.error("Error deleting Promise:", error);
  }
};

// increase coins
export const updatePromise = async (req, res) => {
  try {
    const {id, coins, title, authId} = req.body;
    // Here id is the _id of the promise
    console.log(coins,"COINS")
    const currentPromise = await Promise.findById(id);
    currentPromise.coins = currentPromise.coins + coins;
    // The promise with the specified id has been deleted
    await currentPromise.save();
    
if (coins > 0){

  const user = await User.findById(authId)
  user.currentScore -= coins
    await user.save()
}

    res.status(200).json(currentPromise);
  } catch (error) {
    res.status(500).json({error: "Internal error"});
    console.error("Error updating Promise coins:", error);
  }
};


export const getTotalDonation = async (req,res) =>{
  try{

    const result = await Promise.aggregate([
      { $match: { promise: "Donate to Palestine" } },
      {
        $group: {
          _id: null,
          totalScores: { $sum: "$coins" },
        },
      },
    ]);
    
    // Extract the total scores
    const totalScores = result[0]?.totalScores || 0;
    res.status(200).json(totalScores);

  }catch (error) {
    res.status(500).json({ error: "Internal error" });
    console.error("Error getting total donation", error);
  }

}