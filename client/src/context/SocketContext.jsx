import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();
  const [live, setLive] = useState(false);
  const [liveLink, setLiveLink] = useState("");
  const [isConnected, setIsConnected] = useState(false);
console.log(onlineUsers,"user")
  useEffect(() => {
    let newSocket;

    if (authUser) {
      newSocket = io("http://localhost:3000", {
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
        newSocket.emit("identify", authUser._id);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        setIsConnected(false);
      });

      newSocket.on("live-status", (data) => {
        console.log("Live status received:", data);
        setLive(data.status);
        if (data.status) setLiveLink(data.newStream.link);
      });

      newSocket.on("roomUsers", (users) => {
        console.log("Online users:", users);
        setOnlineUsers(users);
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) {
        newSocket.off("live-status");
        newSocket.off("roomUsers");
        newSocket.close();
      }
    };
  }, [authUser]);

  // Function to manually reconnect if needed
  const reconnect = () => {
    if (socket) {
      socket.connect();
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        live,
        setLive,
        liveLink,
        setLiveLink,
        isConnected,
        reconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};