import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal: {type: String, required: true},
    duration: {type: Number, required: true},
    rating: {type: String, required: true},
    room: {type: String, required: true},
    sessionNumber: {type: String, required: true},
    createdAt: { type: Date, default: new Date() }
  },
  
);
const Session = mongoose.model("Session", sessionSchema);

export default Session;

//identify through id, save sessions by time.date.goal. or save an array to user of session, with dateTime as key and goal as object + done or not ?

//how will I identify Shams and show her the session start + everyone's goal table ? lol I ll give her a secret number at end but now show it in her username.
