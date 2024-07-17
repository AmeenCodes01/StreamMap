import User from "../models/User.js";
import Promise from "../models/Promises.model.js";

export const signup = async (req, res) => {
  try {
    const {name, email, timeZone, country, profilePic, password, displayName} =
      req.body;
    let user;

    if (email !== null) {
      user = await User.findOne({email});
    } else {
      user = await User.findOne({name});
    }

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
        password,
        displayName,
      });

      if (newUser) {
        await newUser.save();

        const donatePromise = new Promise({
          promise: "Donate to Palestine",
          userId: newUser._id,
        });

        await donatePromise.save();

        newUser.p_id = donatePromise._id;

        await newUser.save();

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
    const {name, email, password} = req.body;
    let user;
    let logged = false;
    console.log(name, "name", password);
    if (name) {
      user = await User.findOne({name});
    } else {
      user = await User.findOne({email});
    }
    if (user) {
      if (email) {
        return res.status(201).json(user);
      } else {
        if (user.password === password) {
          logged = true;
        }
        if (logged) {
          return res.status(201).json(user);
        } else {
          return res.status(400).json({error: "password incorrect"});
        }
      }
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
    const {email, name} = req.body;
    let user;

    if (email) {
      user = await User.findOne({email});
    } else if (name) {
      user = await User.findOne({name});
    }

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
