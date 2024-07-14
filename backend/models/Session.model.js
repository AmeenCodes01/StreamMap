import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goal: {type: String, required: false},
  mood: {type: String, required: false},
  duration: {type: Number, required: false},
  score: {type: Number, required: false},
  room: {type: String, required: true},
  sessionNumber: {type: String, required: false},
  rating: {type: Number, required: false},
  createdAt: {type: Date, default: Date.now},
  endedAt: {type: Date},
  timers: {
    type: [
      {
        time: {
          type: Number,
          required: false, // Set required to false for optional field
        },
        desc: {
          type: String,
          required: false, // Set required to false for optional field
        },
      },
    ],
    default: undefined, // Set default value to undefined for optional field
  },
  status: {type: String, default: "end"},
});
const Session = mongoose.model("Session", sessionSchema);

export default Session;
