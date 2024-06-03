import Livestream from "../models/Livestream.model";

export const startLive = async (req, res)=>{
try{

}catch(e){
    console.log(e)
    res.status(500).json({message:"Error"})
}
}