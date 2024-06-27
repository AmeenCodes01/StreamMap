import Promise from "../models/Promises.model.js";

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
    const {id, coins, title} = req.body;
    // Here id is the _id of the promise

    const currentPromise = await Promise.findById(id);
    currentPromise.coins = currentPromise.coins + coins;
    // The promise with the specified id has been deleted
    await currentPromise.save();

    res.status(200).json(currentPromise);
  } catch (error) {
    res.status(500).json({error: "Internal error"});
    console.error("Error updating Promise coins:", error);
  }
};
