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
  coins: {
    type: Number,
    default: 0,
  },

  //name,country,pfp, timezone offset, country color
});
const Promise = mongoose.model("Promise", promiseSchema);

export default Promise;
