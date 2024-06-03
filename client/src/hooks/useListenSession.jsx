import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import { useTimeContext } from "../context/TimeContext";
// import notificationSound from "../assets/sounds/notification.mp3";

const useListenSessions = () => {
	const {allSessions,setAllSessions, seshInfo, setSeshInfo} = useTimeContext()
	const { socket } = useSocketContext();
	const {authUser} = useAuthContext()
	useEffect(() => {
		socket?.on("newSession", (newSession) => {
			// newMessage.shouldShake = true;
			// const sound = new Audio(notificationSound);
			// sound.play();
        
			setAllSessions([...allSessions, newSession]) 
			if(newSession.userId == authUser._id){
				console.log("same")
				console.log(seshInfo)
			setSeshInfo([...seshInfo,newSession])
			}
		});

		return () => socket?.off("newSession");
	}, [socket, allSessions, setAllSessions, seshInfo, setSeshInfo]);
};
export default useListenSessions;