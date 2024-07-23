import {useState} from "react";
import {config} from "../config";
const useGetRoomRankings = () => {
  const [loading, setLoading] = useState(false);
  // const {onlineUsers} = useSocketContext()
  const getRankings = async (room) => {
    //for specific rooms, this means I ll only query when user joins room.
    //separate this func + call on mount from AllSessions :))

    setLoading(true);
    try {
      const res = await fetch(`${config.API_URL}/api/score/ranking`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({room}),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // setSessions(data);
      return data;
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getLiveRankings = async (room) => {
    //for specific rooms, this means I ll only query when user joins room.
    //separate this func + call on mount from AllSessions :))

    setLoading(true);

    try {
      const res = await fetch(`${config.API_URL}/api/score/liveRanking`, {
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
      return data;
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {loading, getRankings, getLiveRankings};
};
export default useGetRoomRankings;
