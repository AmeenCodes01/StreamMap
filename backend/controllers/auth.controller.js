import User from "../models/User.js";
import {generateTokenAndSetCookie} from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const {name, email, timeZone, country, color, profilePic} = req.body;
    console.log(timeZone)
    const user = await User.findOne({email});
    if (user) {
      return res.status(400).json({error: "User already exists"});
      //send data through sessions. if user, then use userId here ? , else add him up.
    } else {
      const newUser = new User({
        name,
        email,
        timeZone,
        country,
        color,
        profilePic,
      });
      if (newUser) {
        generateTokenAndSetCookie(newUser._id, res);

        await newUser.save();

        res.status(201).json({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          timeZone: newUser.timeZone,
          country: newUser.country,
          color: newUser.color,
          profilePic: newUser.profilePic,
        });
      } else {
        res.status(400).json({error: "Invalid User data"});
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({error: "Internal Server Error"});
  }
};



export const login = async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    console.log(email);
    if (user) {
  const token =  generateTokenAndSetCookie(user._id, res);
      console.log(token)
      return res.status(201).json({user, token});
      //send data through sessions. if user, then use userId here ? , else add him up.
    } else {
      return res.status(400).json({error: "User does not exist"});
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({error: "Internal Server Error"});
  }
};
export const check = async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    console.log(email);
    if (user) {
      return res.status(200).json({exist: "true"});
    } else {
      return res.status(200).json({exist: "false"});
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({error: "Internal Server Error"});
  }
};
export const logout = (req, res) => {
  //   try {
  //     res.cookie("jwt", "", {maxAge: 0});
  //     res.status(200).json({message: "Logged out successfully"});
  //   } catch (error) {
  //     console.log("Error in logout controller", error.message);
  //     res.status(500).json({error: "Internal Server Error"});
  //   }
};
