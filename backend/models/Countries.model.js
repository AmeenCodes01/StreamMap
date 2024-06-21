import mongoose from "mongoose";
const colorSchema = new mongoose.Schema(
  {
    
    country: {type: String, required: true},

    color: {type: String, required: true},
  

    //name,country,pfp, timezone offset, country color
  },
);
const Countries = mongoose.model("Country", colorSchema);

export default Countries;
