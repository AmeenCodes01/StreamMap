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

      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };
  const checkLive = async (sentRoom) => {
    console.log("checkLive", sentRoom);

    try {
      const res = await fetch("/api/live/checkLive", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({sentRoom}),
      });
      const data = await res.json();
      console.log(data, "live");
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
