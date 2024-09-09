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
    mode,
    setSecondsLeft,
    resetInSesh,
    breakMinutes,
    prevSeshRating,
    setPrevSeshRating,
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
      setSecondsLeft: state.setSecondsLeft,
      resetInSesh: state.resetInSesh,
      breakMinutes: state.breakMinutes,
      prevSeshRating: state.prevSeshRating,
      setPrevSeshRating: state.setPrevSeshRating,
    }))
  );

  const {key, room} = useAuthId();
  const {socket, live} = useSocketContext();
  const {startSession, checkPrevSession, resetSession} = useSaveSession();

  const start = async (session) => {
    //first check if starting or unpausing. If starting, then check prevRated. if message recieved of ongoing, display to user that. I think the codebase is becoming too messy, I should pause and start to figure out what my code is
    //doing and how to optimise it.
    //For now, I will only optimise the rateSession part, nothing else.
    //Also end session one calll, then rating another ? ( no, later on. )

    //-----------step 1 => separate isRunning & prevSesh logic. -----------
    //-----step 2 => check the states sessionRating is using and how ?  ---------
    //------------step 3 => deleteSession option.---------
    //step 4 => customise display text for rating acc to prevRating() --------

    if (isRunning) {
      //resuming from pause
      setIsPaused(false);
    } else {
      //starting new sesh
      const prevRated = await checkPrevSession();
      if (prevRated) {
        localStorage.setItem(`${key}startTime`, Date.now());
        // checkSession, not rated, setShowRating false & sessionId to LS.
        setIsPaused(false);
        setIsRunning(true);
        setRated(false);
        secondsLeft === workMinutes * 60 ? startSession(session) : null;
        // secondsLeft !== workMinutes * 60 && mode === "work" && live
        //   ? socket.emit("paused-session", {
        //       id: localStorage.getItem("sessionID"),
        //       room,
        //       pause: false,
        //     })
        //   : null;
      } else {
        setRated(false);
        setShowRating(true);
        setPrevSeshRating(true);
      }
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
    if (isRunning || (!isRunning && prevSeshRating)) console.log("reset ", md);
    localStorage.removeItem(`${key}startTime`);
    localStorage.removeItem(`${key}PausedTime`);

    const resetSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
    if (mode === "work" || md == "delete") {
      resetInSesh();
      setRated(false);
      // setDisabled(false)
      //setShowRating(false)
      resetSession();
    }

    setSecondsLeft(resetSeconds);
    setIsRunning(false);
    setIsPaused(true);
  };

  return {
    start,
    pause,
    reset,
  };
};

export default usePomodoro;
