import {createContext, useState, useEffect, useContext} from "react";
import {useAuthContext} from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const {authUser} = useAuthContext();
  const [live, setLive] = useState(false);
  const [liveID, setLiveID] = useState(localStorage.getItem("liveID") || null);
  useEffect(() => {
    if (socket == null) return;
    socket.on("live-status", (data) => {
      console.log("Live status received:", data);
      setLive(data.status);
    });

    // Cleanup function
    return () => {
      // Remove the event listener when the component unmounts
      socket.off("live-status");
    };
  }, [socket]);

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:3000");
      // Identify the user with the server
      socket.emit("identify", authUser._id);
      setSocket(socket);
      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, []);

  useEffect(() => {
    if (socket === null) return;
    const handler = (e) => {
      setOnlineUsers(e);
    };
    socket.on("roomUsers", handler);

    return () => {
      socket.off("roomUsers", handler);
    };
  }, [socket, authUser]);
  return (
    <SocketContext.Provider
      value={{liveID, setLiveID, socket, onlineUsers, live, setLive}}
    >
      {children}
    </SocketContext.Provider>
  );
};

// now everytime I start a session, I want it to go to all clients. I will store its ID & status as active on server-side. will send this when user joins.
