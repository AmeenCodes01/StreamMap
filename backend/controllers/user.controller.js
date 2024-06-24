import User from "../models/User.js";
//need to have a session ID.
import Countries from "../models/Countries.model.js";

// export const getSessions = (req, res) => {};
export const getUsers = async (req, res) => {
  try {
    const {ids} = req.body;

    const users = await User.find({_id: {$in: ids}})
      .select("name _id country profilePic timeZone")
      .exec();
    // Step 2: Group users by country
    const groupedUsers = users.reduce((acc, user) => {
      const country = user.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(user);
      return acc;
    }, {});

    // Step 3: Join color information for each country
    for (const country in groupedUsers) {
      const colorInfo = await Countries.findOne({country}).exec();
      groupedUsers[country].forEach((user) => {
        user.color = colorInfo.color;
      });
    }

    for (const country in groupedUsers) {
      const usersByTimeZone = groupedUsers[country].reduce((acc, user) => {
        const timeZone = user.timeZone;
        if (!acc[timeZone]) {
          acc[timeZone] = [];
        }
        acc[timeZone].push(user);
        return acc;
      }, {});
      groupedUsers[country] = Object.values(usersByTimeZone);
    }
    res.status(200).json(groupedUsers);
  } catch (e) {
    console.log(e.message);
    console.error("Error in getUsers: ", e.message);
    res.status(500).json({error: "Internal  error"});
  }
};      
//why are we calling this in the first place ? no use in getting all users, is there

export const changeCountry = async (req, res) => {
  try {
    const {newCountry, id} = req.body;    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.country = newCountry;
    await user.save();
  } catch (e) {
    console.error("Error in changeCountry: ", e.message);
    res.status(500).json({error: "Internal Country Change  error"});
  }
};
   