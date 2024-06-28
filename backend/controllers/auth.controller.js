import User from "../models/User.js";
import Promise from "../models/Promises.model.js";



export const signup = async (req, res) => {
  try {
    const {name, email, timeZone, country, profilePic} = req.body;
    const user = await User.findOne({email});

    if (user) {
      return res.status(400).json({error: "User already exists"});
      //send data through sessions. if user, then use userId here ? , else add him up.
    } else {
      //create promise.

      const newUser = new User({
        name,
        email,
        timeZone,
        country,
        profilePic,
        });
                
        if (newUser) {
          await newUser.save();
          
          const donatePromise = new Promise({
            promise: "Donate to Palestine",
            userId: newUser._id
            });
            
          await donatePromise.save();
         
          newUser.p_id = donatePromise._id
          
          await newUser.save()
        console.log(donatePromise,newUser, "onSIGNUP")
          
        res.status(201).json(newUser);
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
    if (user) {
      return res.status(201).json(user);
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
