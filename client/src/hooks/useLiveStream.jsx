import {useParams} from "react-router-dom";
import {useSocketContext} from "../context/SocketContext";

export const useLiveStream = () => {
  const {id: room} = useParams();
  const {setLive} = useSocketContext();
  const startLive = async () => {
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
      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const endLive = async () => {
    let ranking;
    try {
      //getLiveRanking first 3.
      const rankingRes = await fetch("/api/score/liveRanking", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({room}),
      });

      const rankingData = await rankingRes.json();
      if (rankingData.error) {
        throw new Error(data.error);
      }

      ranking = rankingData.slice(0, 3);

      ///////////////////////
      const res = await fetch("/api/live/endLive", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({room, ranking}),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkLive = async (sentRoom) => {

    try {
      const res = await fetch("/api/live/checkLive", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({sentRoom}),
      });
      const data = await res.json();
      setLive(data.live);
      if (data.error) {
        throw new Error(data.error);
      }
      // setSessions(data);
      // console.log(data)
      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  return {startLive, endLive, checkLive};
};
//1719785504432 