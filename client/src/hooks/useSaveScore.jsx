import toast from "react-hot-toast";
import {useState} from "react";
import {useAuthContext} from "../context/AuthContext";

const useSaveScore = () => {
  const [loading, setLoading] = useState(false);
  const {authUser} = useAuthContext();
  console.log(authUser._id);
  const saveScore = async (score, room, id) => {
    setLoading(true);
    try {
      const res = await fetch("/api/score/saveScore", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({score, room, id}),
      });

      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const getScore = async () => {
    try {
      const res = await fetch("/api/score/getScore", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: authUser._id}),
      });

      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {saveScore, loading, getScore};
};

export default useSaveScore;
