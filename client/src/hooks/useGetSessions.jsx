import {useEffect, useState} from "react";
import useAuthId from "../hooks/useAuthId";
import useStore from "../context/TimeStore";
import {useShallow} from "zustand/react/shallow";
const useGetSessions = () => {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const {seshInfo, setSeshInfo} = useStore(
    useShallow((state) => ({
      seshInfo: state.seshInfo,
      setSeshInfo: state.setSeshInfo,
    }))
  );
  const {authId} = useAuthId();

  // const {onlineUsers} = useSocketContext()
  const getSessions = async (room) => {
    //for specific rooms, this means I ll only query when user joins room.
    //separate this func + call on mount from AllSessions :))

    setLoading(true);
    try {
      const res = await fetch("https://streammap.onrender.com/api/sessions", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: authId}),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // setSessions(data);
      return data;
    } catch (error) {
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserSessions = async () => {
    setLoading(true);
    console.log("getting user sessions");
    try {
      const res = await fetch(
        "https://streammap.onrender.com/api/sessions/user",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({id: authId}),
        }
      );
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setSeshInfo(data.reverse());
    } catch (error) {
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // s

  return {loading, setSessions, getSessions, getUserSessions};
};
export default useGetSessions;
