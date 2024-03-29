import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    country: {type: String, required: true},

    offset: {
      type: Number,
    },
    color: {type: String, required: true},
    profilePic: {type: String, required: true},
    admin: {
      type: Boolean,
      default: false,
    },
    //name,country,pfp, timezone offset, country color
  },
  {timestamps: true}
);
const User = mongoose.model("User", userSchema);

export default User;
