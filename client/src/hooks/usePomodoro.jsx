import useStore from "../context/TimeStore";
import {useSocketContext} from "../context/SocketContext";
import {useShallow} from "zustand/react/shallow";
import useAuthId from "./useAuthId";
import useSaveSession from "./useSaveSession";
const usePomodoro = () => {
  const {
    isRunning,
    setIsRunning,
    setIsPaused,
    setRated,
    secondsLeft,
    workMinutes,
    setShowRating,
    mode,setSecondsLeft, resetInSesh, 
    breakMinutes,
    setPrevSeshRating
  } = useStore(
    useShallow((state) => ({
      isRunning: state.isRunning,
      setIsRunning: state.setIsRunning,
      setIsPaused: state.setIsPaused,
      workMinutes: state.workMinutes,
      setRated: state.setRated,
      secondsLeft: state.secondsLeft,
      mode: state.mode,
      setShowRating: state.setShowRating,
      setSecondsLeft:state.setSecondsLeft,
      resetInSesh: state.resetInSesh,
      breakMinutes: state.breakMinutes,
      setPrevSeshRating: state.setPrevSeshRating
      


    }))
  );
  const {key, room} = useAuthId();
  const {socket, live} = useSocketContext();
  const {startSession, checkPrevSession,resetSession} = useSaveSession();

  const start =async (session) => {

    const prevRated = await checkPrevSession()
if (prevRated){

  
  !isRunning ? localStorage.setItem(`${key}startTime`, Date.now()) : null;
  // checkSession, not rated, setShowRating false & sessionId to LS. 
  setIsPaused(false);
  setIsRunning(true);
    setRated(false);
    secondsLeft === workMinutes * 60 ? startSession(session) : null;
    secondsLeft !== workMinutes * 60 && mode === "work" && live
      ? socket.emit("paused-session", {
          id: localStorage.getItem("sessionID"),
          room,
          pause: false,
        })
      : null;
    }else{
      setRated(false)
      setShowRating(true)
      setPrevSeshRating(true)
    }
  };

  const pause = () => {
    setIsPaused(true);
    setIsRunning(true);
    localStorage.setItem(`${key}PausedTime`, secondsLeft);
    localStorage.setItem(`${key}isRunning`, "true");

    secondsLeft !== workMinutes * 60 && mode === "work" && live
      ? socket?.emit("paused-session", {
          id: localStorage.getItem("sessionID"),
          room,
          pause: true,
        })
        : null;
      };

      const reset = (md) => {
        localStorage.removeItem(`${key}startTime`);
        localStorage.removeItem(`${key}PausedTime`);
        
        
        
        const resetSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
        if(mode ==="work" || md=="delete"){
          resetInSesh();
          setRated(false);
         // setDisabled(false)
          //setShowRating(false)
          secondsLeft !== resetSeconds  ? resetSession() : null;
        }
        
        setSecondsLeft(resetSeconds);
        setIsRunning(false);
        setIsPaused(true);
      };
    

  return {
    start,
    pause,
    reset
  };
};

export default usePomodoro;
