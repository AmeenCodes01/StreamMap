import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
// import useAuthId from "../hooks/useAuthId";
import { useAuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import toast from "react-hot-toast";
import {config} from "../config";
const showLongErrorToast = (message, type = "error") => {
  const icons = {
    info: "❗️",
    error: "❌",
    success: "✅",
  };

  toast(
    (t) => (
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "12px",
          maxWidth: "300px",
          width: "100%",
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
          <span style={{fontSize: "20px"}}>{icons[type]}</span>
          <p
            style={{
              margin: 0,
              color: "#333",
              fontSize: "14px",
              fontWeight: 500,
              zIndex: "1000000000",
            }}
          >
            {message}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            background: "#4B5563",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            alignSelf: "flex-end",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#374151")}
          onMouseLeave={(e) => (e.target.style.background = "#4B5563")}
        >
          Dismiss
        </button>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-center",
      style: {
        background: "white",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        color: "#333",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
      },
    }
  );
};

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({children}) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  // const {authId} = useAuthId();
  const [live, setLive] = useState(false);
  const [liveLink, setLiveLink] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const {authUser} = useAuthContext()
  const socket = useMemo(() => {
    if (authUser === null) return null;

    const newSocket = io(`${config.API_URL}`, {
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      newSocket.emit("identify", authUser);
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
      if (data.status) setLiveLink(data.link);
    });

    newSocket.on("roomUsers", (users) => {
      console.log("Online users:", users);
      setOnlineUsers(users);
    });

    newSocket.on("forced_disconnect", (message) => {
      showLongErrorToast(message);
      setIsConnected(false);
    });

    return newSocket;
  }, [authUser]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.off("live-status");
        socket.off("roomUsers");
        socket.close();
      }
    };
  }, [socket]);

  const reconnect = useCallback(() => {
    if (socket) {
      socket.connect();
    }
  }, [socket]);

  const contextValue = useMemo(
    () => ({
      socket,
      onlineUsers,
      live,
      setLive,
      liveLink,
      setLiveLink,
      isConnected,
      reconnect,
    }),
    [socket, onlineUsers, live, liveLink, isConnected, reconnect]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
