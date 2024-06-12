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
    res.status(500).json({ error: "Internal  error" });
  }
};
//why are we calling this in the first place ? no use in getting all users, is there 

};
export const changeCountry = async (req, res) => {
  try {
   const {newCountry, id} = req.body
   const user = await User.findById(userId);
     if (!user) {
      throw new Error("User not found");
    }
    user.country = newCountry 
    await user.save()
  } catch (e) {
 console.error("Error in changeCountry: ", e.message);
    res.status(500).json({ error: "Internal Country Change  error" });
  }
};
