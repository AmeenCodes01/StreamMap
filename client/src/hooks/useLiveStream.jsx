import {useEffect} from "react";
import toast from "react-hot-toast";
import {useParams} from "react-router-dom";
import {config} from "../config";
export const useLiveStream = () => {
  const {id: room} = useParams();
  
  const startLive = async (room, link) => {
    try {
      const res = await fetch(`${config.API_URL}/api/live/startLive`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({room, link}),
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

  const endLive = async (room) => {
    let ranking;
    try {
      //getLiveRanking first 3.
      const rankingRes = await fetch(
        `${config.API_URL}/api/score/liveRanking`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({room}),
        }
      );

      const rankingData = await rankingRes.json();
      if (rankingData.error) {
        throw new Error(data.error);
      }

      ranking = rankingData.slice(0, 3);

      ///////////////////////
      const res = await fetch(`${config.API_URL}/api/live/endLive`, {
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
      const res = await fetch(`${config.API_URL}/api/live/checkLive`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({sentRoom}),
      });
      const data = await res.json();
      // setLive(data.live);

      // console.log(data, "check");
      // setLiveLink(data.link);
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

  // useEffect(() => {
  //   console.log("checking for live");
  //   if (room) checkLive(room);
  // }, [room]);

  return {startLive, endLive, checkLive};
};
