<<<<<<< HEAD
import { useParams } from "react-router-dom";
import { useSocketContext } from "../context/SocketContext";    

export const useLiveStream =()=>{     
  const { id: room } = useParams();
  const {setLive} = useSocketContext()
    const startLive = async ()=>{
      try {
          const res = await fetch("/api/live/startLive", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({room}),
          });
          const data = await res.json();
          if (data.error) {
            throw new Error(data.error);
          }
          // setSessions(data);
         // console.log(data)
          return data 
        } catch (error) {
           toast.error(error.message);
        }
    }
    
    const endLive = async ()=> {
    try {
          const res = await fetch("/api/live/endLive", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({room}),
          });
          const data = await res.json();
          if (data.error) {
            throw new Error(data.error);
          }
      
          return data 
        } catch (error) {
           toast.error(error.message);
        } 
    }
    const checkLive = async (sentRoom)=> {
      console.log("checkLive", sentRoom)
      
      try {
            const res = await fetch("/api/live/checkLive", {
              method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({sentRoom}),
            });
            const data = await res.json();
            setLive(data.live)
            if (data.error) {
              throw new Error(data.error);
            }
            // setSessions(data);
           // console.log(data)
            return data 
          } catch (error) {
          toast.error(error.message);
          } 
      }
    
    return {startLive,endLive, checkLive}
    }
=======


export const useLiveStream =()=>{
const startLive = (room)=>{
  try {
      const res = await fetch("/api/live/start", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: authUser._id}),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // setSessions(data);
     // console.log(data)
      return data 
    } catch (error) {
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
}

const endLive = (room) => {
try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: authUser._id}),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // setSessions(data);
     // console.log(data)
      return data 
    } catch (error) {
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
}
//get room latest session & end it or start it. 
}
>>>>>>> 4881f169b34ebefabd6a9c5b8a0837801725b0f0
