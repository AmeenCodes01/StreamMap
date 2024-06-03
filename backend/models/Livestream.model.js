import mongoose from "mongoose";

const LivestreamSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now }   ,
     endedAt: { type: Date, required: false },
    ranking: [{ userId: String, ranking: Number }]
  }
);

const Livestream = mongoose.model("Livestream", LivestreamSchema);

export default Livestream;
