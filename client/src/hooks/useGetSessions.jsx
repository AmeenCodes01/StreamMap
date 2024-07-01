import {useEffect, useState} from "react";
import useAuthId from "../hooks/useAuthId"

const useGetSessions = () => {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [userSessions, setUserSessions] = useState([]);

  const {authId} = useAuthId()

  // const {onlineUsers} = useSocketContext()
  const getSessions = async (room) => {
    //for specific rooms, this means I ll only query when user joins room.
    //separate this func + call on mount from AllSessions :))

    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
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

  useEffect(() => {
    const getUserSessions = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/sessions/user", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({id: authId}),
        });
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setUserSessions(data);
      } catch (error) {
        // toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    // getSessions();
    getUserSessions();
  }, []);

  return {loading, sessions, userSessions, setSessions, getSessions};
};
export default useGetSessions;
