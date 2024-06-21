import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
<<<<<<< HEAD
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();
  const [live, setLive] = useState(false);
  const [liveID, setLiveID] = useState(localStorage.getItem("liveID") || null);
  useEffect(() => {
    if (socket == null) return;
    socket.on("live-status", (data) => {
      console.log("Live status received:", data);
      setLive(data.status);
    });
=======
	
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser,room } = useAuthContext( );
	const [live, setLive] = useState();
	//local storage not required since socket will send every refresh anyways"
	const [liveID, setLiveID] = useState(localStorage.getItem("liveID") || null
	)
	localStorage
	useEffect(() => {
		if (socket == null)return  
		// Listen for the "live-status" event
		socket.on("live-status", (data) => {
			console.log("Live status received:", data);
			if (data.status !==false){
				setLive(true)
			setLiveID(data.livestreamID); // Update state with the live status
			localStorage.setItem("live", "true") 
			localStorage.setItem("liveID", data.livestreamID)
		} else{
			setLiveID()
			setLive(false)
			localStorage.removeItem("live")
		}
		});
	  
		// Cleanup function
		return () => {
		  // Remove the event listener when the component unmounts
		  socket.off("live-status");
		};
	  }, [socket]);
console.log(live,"LIVRVWESEDSDWRFV")
	useEffect(() => {
		if (authUser) {
			const socket = io("http://localhost:3000", 
            // {
			// 	query: {
			// 		userId: authUser._id,
			// 	},
			// }
            );
>>>>>>> 4881f169b34ebefabd6a9c5b8a0837801725b0f0

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
      value={{ liveID, setLiveID, socket, onlineUsers, live, setLive }}
    >
      {children}
    </SocketContext.Provider>
  );
};

<<<<<<< HEAD
// now everytime I start a session, I want it to go to all clients. I will store its ID & status as active on server-side. will send this when user joins.
=======

// now everytime I start a session, I want it to go to all clients. I will store its ID & status as active on server-side. will send this when user joins. 
>>>>>>> 4881f169b34ebefabd6a9c5b8a0837801725b0f0
