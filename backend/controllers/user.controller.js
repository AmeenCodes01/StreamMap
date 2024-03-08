import User from "../models/User.js";
//need to have a session ID.

// export const getSessions = (req, res) => {};
export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.body.userId;
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (e) {
    console.log(e.message);
    console.error("Error in getUsers: ", e.message);
    res.status(500).json({error: "Internal  error"});
  }
};
