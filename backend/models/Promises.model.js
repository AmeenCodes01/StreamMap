import mongoose from "mongoose";
const promisesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Promises: {
    type: [
      {
        promise: {
          type: String,
          required: true,
        },
        coins: {
          type: Number,
        },
      },
    ],
  },

  //name,country,pfp, timezone offset, country color
});
const Promises = mongoose.model("Promise", promisesSchema);

export default Promises;
