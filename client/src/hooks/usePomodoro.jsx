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
    mode,
  } = useStore(
    useShallow((state) => ({
      isRunning: state.isRunning,
      setIsRunning: state.setIsRunning,
      setIsPaused: state.setIsPaused,
      workMinutes: state.workMinutes,
      setRated: state.setRated,
      secondsLeft: state.secondsLeft,
      mode: state.mode,
    }))
  );
  const {key, room} = useAuthId();
  const {socket, live} = useSocketContext();
  const {startSession} = useSaveSession();

  const start = (session) => {
    !isRunning ? localStorage.setItem(`${key}startTime`, Date.now()) : null;

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

  return {
    start,
    pause,
  };
};

export default usePomodoro;
