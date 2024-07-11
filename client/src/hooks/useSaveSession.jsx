import toast from "react-hot-toast";
import {useState} from "react";
import {useSocketContext} from "../context/SocketContext";
import useAuthId from "./useAuthId";
const useSaveSession = () => {
  const [loading, setLoading] = useState(false);
  const [sessionID, setSessionID] = useState(localStorage.getItem("sessionID"));
  const {socket, live} = useSocketContext();
  const {authId, name, room} = useAuthId();

  const startSession = async (session) => {
    setLoading(true);
    console.log(session, "sessionSTART ");
    session.live = live;
    try {
      const res = await fetch("/api/sessions/start", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({session, name, live}),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      console.log(data, "new session data");
      setSessionID(data._id);
      localStorage.setItem("sessionID", data._id);
      session["sessionID"] = sessionID;
      session["goal"] = session.goal;
      session["userId"] = authId;
      socket?.emit("start-session", session);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSession = async (session) => {
    session.live = live;
    const sessionID = localStorage.getItem("sessionID");
    session["sessionID"] = sessionID;
    console.log(session, "s e s s i o n ");
    setLoading(true);
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

  const resetSession = async () => {
    setLoading(true);
    try {
      const sessionID = localStorage.getItem("sessionID");
      const res = await fetch("/api/sessions/reset", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: sessionID, room, live}),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return {startSession, saveSession, loading, sessionID, resetSession};
};

export default useSaveSession;

// For live,
// I want to store only ongoing sessions with total score + duration carried on since live starts.
// lmao we are already receiving them in useSaveSession. only need totalDuration,totalScore. And how is a new user going to get since live ones. keep track of totalScore, totalDuration,room,userId on server.
// ongoing session status as well. { room: [{sessionID: status}] }
// we get all prev sessions from getLiveRankings(). get status and add to the state. when newSession comes, add score and duration, while replacing older session.
// so we dont need start and stop session lol.

//add session ID and status to sessions object. on end, delete.
