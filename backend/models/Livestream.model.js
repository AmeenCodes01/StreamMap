import mongoose from "mongoose";

const LivestreamSchema = new mongoose.Schema({
  createdAt: {type: Date, default: Date.now},
  endedAt: {type: Date, required: false},
  ranking: [{userId: String, ranking: Number, required: false}],
  room: {type: String, required: true},
  link: {type: String, required: true},
});

const Livestream = mongoose.model("Livestream", LivestreamSchema);

export default Livestream;
