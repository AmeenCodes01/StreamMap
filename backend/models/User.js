import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    password: {type: String, required: false},
    email: {type: String, required: false},
    country: {type: String, required: true},
    displayName: {type: String},
    timeZone: {
      type: String,
    },
    profilePic: {type: String, required: false},
    admin: {
      type: Boolean,
      default: false,
    },
    adminRoom: {
      type: String,
      default: "",
    },
    scores: [{score: Number, room: String}],
    p_id: {type: String, unique: true},
    currentScore: {type: Number, default: 0},
    //name,country,pfp, timezone offset, country color, currentScore
  },
  {timestamps: true}
);
const User = mongoose.model("User", userSchema);

export default User;
