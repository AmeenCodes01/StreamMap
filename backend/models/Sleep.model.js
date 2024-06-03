import mongoose from "mongoose";

const sleepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    hours: {type: Number, required: true},
    
    createdAt: { type: Date, default: Date.now }    
  },
  
);
const Sleep = mongoose.model("Sleep", sleepSchema);

export default Sleep;

//identify through id, save sessions by time.date.goal. or save an array to user of session, with dateTime as key and goal as object + done or not ?

