import {useState, useEffect} from "react";
import toast from "react-hot-toast";

import {useSocketContext} from "../context/SocketContext";
import useAuthId from "./useAuthId";
import {config} from "../config";
import {useNetworkStatus} from "./useNetworkStatus";
const useSaveSession = () => {
  const [loading, setLoading] = useState(false);
  const {socket, live} = useSocketContext();
  const {authId, name, room, key} = useAuthId();
  const isOnline = useNetworkStatus();
  const [sessionID, setSessionID] = useState(
    localStorage.getItem(`${key}sessionID`)
  );

  const [offlineQueue, setOfflineQueue] = useState(() => {
    const savedQueue = localStorage.getItem(`${key}offlineQueue`);
    return savedQueue ? JSON.parse(savedQueue) : [];
  });

  useEffect(() => {
    localStorage.setItem(`${key}offlineQueue`, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      processOfflineQueue();
    }
  }, [isOnline]);

  const processOfflineQueue = async () => {
    for (const queuedAction of offlineQueue) {
      try {
        if (queuedAction.type === "start") {
          await startSession(queuedAction.session);
        } else if (queuedAction.type === "save") {
          await saveSession(queuedAction.session);
        } else if (queuedAction.type === "reset") {
          await resetSession();
        }
      } catch (error) {
        console.error("Failed to process queued action:", error);
      }
    }
    setOfflineQueue([]);
  };

  const checkPrevSession = async () => {
    try {
      const res = await fetch(`${config.API_URL}/api/sessions/check`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: authId}),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      console.log(data, "DATA ");
      if (data.message == "rated") {
        return true;
      } else if (data.message == "not rated") {
        localStorage.setItem(`${key}sessionID`, data.sessionID);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startSession = async (session) => {
    setLoading(true);
    session.live = live;

    if (!isOnline) {
      setOfflineQueue((prev) => [...prev, {type: "start", session}]);
      toast.info(
        "You are offline. Session will be started when you are back online."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${config.API_URL}/api/sessions/start`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({session, name, live, userId: authId}),
      });

      const data = await res.json();
      if (data.error) {
        if (data.error === "previous session ongoing") {
          toast.error(data.error);
        } else {
          throw new Error(data.error);
        }
      }
      setSessionID(data._id);
      localStorage.setItem(`${key}sessionID`, data._id);
      session["sessionID"] = data._id;
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
    setLoading(true);
    session.live = live;
    const sessionID = localStorage.getItem(`${key}sessionID`);
    console.log(sessionID, "sID");
    session["sessionID"] = sessionID;

    if (!isOnline) {
      setOfflineQueue((prev) => [...prev, {type: "save", session}]);
      toast.info(
        "You are offline. Session will be saved when you are back online."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${config.API_URL}/api/sessions/save`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(session),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.removeItem(`${key}sessionID`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSession = async () => {
    setLoading(true);

    if (!isOnline) {
      setOfflineQueue((prev) => [...prev, {type: "reset"}]);
      toast.info(
        "You are offline. Session will be reset when you are back online."
      );
      setLoading(false);
      return;
    }

    try {
      const sessionID = localStorage.getItem(`${key}sessionID`);
      console.log("reset  ", sessionID);
      const res = await fetch(`${config.API_URL}/api/sessions/reset`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: sessionID, room, live}),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.removeItem(`${key}sessionID`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const ratePrevSession = async (rating, room) => {
    try {
      const sessionID = localStorage.getItem(`${key}sessionID`);

      const res = await fetch(`${config.API_URL}/api/sessions/rate`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: sessionID, rating, room}),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      console.log(data, "session data  ");
      if (data.message == "rated") {
        return true;
      } else if (data.message == "not rated") {
        localStorage.setItem(`${key}sessionID`, data.sessionID);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    startSession,
    saveSession,
    loading,
    sessionID,
    resetSession,
    checkPrevSession,
    ratePrevSession,
  };
};

export default useSaveSession;
