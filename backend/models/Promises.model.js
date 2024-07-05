import mongoose from "mongoose";
const promiseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  promise: {
    type: String,
    required: true,
  },
  // coins: [{score: Number, room: String}],
  coins: Number


  //name,country,pfp, timezone offset, country color
});
const Promise = mongoose.model("Promise", promiseSchema);

export default Promise;
//coins : [ {room: coins}, {room, coins}]