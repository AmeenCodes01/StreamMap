import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import Cookies from 'universal-cookie';

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();
       
	// useEffect(() => {
	// 	no-op if the socket is already connected
	// 	if (authUser) {
	// 		const socket = io("http://localhost:3000", 
    //         {
	// 			query: {
	// 				userId: authUser._id,
	// 			},
	// 		}
    //         );

	// 		setSocket(socket);
		
	// 	return () => {
	// 	  socket.disconnect();
	// 	}};
	//   }, [authUser]);


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

			const cookies = new Cookies();
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
	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};