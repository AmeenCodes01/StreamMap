import toast from "react-hot-toast";
import { useState } from "react";

const useSaveScore =  ()=> {
    const [loading, setLoading] = useState(false);

const saveScore = async (score,room, id)=> {
    setLoading(true)
    try {
        const res = await fetch("/api/score/saveScore", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({score,room,id}),
        });
  
        const data = await res.json();
        if (data.error) {
          console.log(data.error)
          throw new Error(data.error);
        }
  
        
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    return {saveScore, loading};
}

        


export default useSaveScore