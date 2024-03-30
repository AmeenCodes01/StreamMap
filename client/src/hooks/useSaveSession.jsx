import toast from "react-hot-toast";
import { useState } from "react";

const useSaveSession =  ()=> {
    const [loading, setLoading] = useState(false);

const saveSession = async (session)=> {
    console.log(session)
    setLoading(true)
    try {
        const res = await fetch("/api/sessions/save", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(session),
        });
  
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
  
        
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    return {saveSession, loading};
}

        


export default useSaveSession