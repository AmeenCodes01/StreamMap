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
	const { authUser,room } = useAuthContext( );
	const [live, setLive] = useState(localStorage.getItem("live")==="true");
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

			// Identify the user with the server
			socket.emit('identify', authUser._id);
			setSocket(socket);

			
			// const jwtToken = cookies.get('jwt');
		
			// if (jwtToken) {
			// 	console.log(jwtToken)
			// 	socket.emit("tokenCheck", jwtToken )
			// } else {
			//   console.log('Token not found in cookies');
			// }
			
					
			// // socket.on() is used to listen to the events. can be used both on client and server side
			// socket.on("getOnlineUsers", (newUser) => {
			// 	console.log(newUser)
			// 	setOnlineUsers([...onlineUsers, newUser]);
			// });

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
			console.log("gyg")   
			console.log(e)
		  setOnlineUsers(e);
		};
		socket.on("roomUsers", handler
		);
	
		return () => {
		  socket.off("roomUsers", handler);
		};
	  }, [socket, authUser]);
	return <SocketContext.Provider value={{liveID, setLiveID, socket, onlineUsers,live, setLive }}>{children}</SocketContext.Provider>;
};


// now everytime I start a session, I want it to go to all clients. I will store its ID & status as active on server-side. will send this when user joins. 