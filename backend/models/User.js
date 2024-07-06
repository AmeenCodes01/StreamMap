import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    country: {type: String, required: true},

    timeZone: {
      type: String,
    },
    profilePic: {type: String, required: true},
    admin: {
      type: Boolean,
      default: false,
    },
    scores: [{score: Number, room: String}],
    p_id: {type: String, unique: true},
    currentScore: {type:Number, default:0},
    //name,country,pfp, timezone offset, country color, currentScore
  },
  {timestamps: true}
);
const User = mongoose.model("User", userSchema);

export default User;
