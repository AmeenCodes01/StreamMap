import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useTimeContext } from "../context/TimeContext";
// import notificationSound from "../assets/sounds/notification.mp3";
import useAuthId from "./useAuthId";
const useListenSessions = () => {
	const {allSessions,setAllSessions, seshInfo, setSeshInfo} = useTimeContext()
	const { socket } = useSocketContext();
	const authId = useAuthId()
	useEffect(() => {
		socket?.on("newSession", (newSession) => {
			// newMessage.shouldShake = true;
			// const sound = new Audio(notificationSound);
			// sound.play();
        
			setAllSessions([...allSessions, newSession]) 
			if(newSession.userId == authId){
			setSeshInfo([...seshInfo,newSession])
			}
		});

		return () => socket?.off("newSession");
	}, [socket, allSessions, setAllSessions, seshInfo, setSeshInfo]);
};
export default useListenSessions;