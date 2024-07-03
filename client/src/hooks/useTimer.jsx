import {useEffect, useRef, useCallback, useState} from "react";
import useStore from "../context/TimeStore";
import useAuthId from "./useAuthId";
import {setInterval, clearInterval} from "worker-timers";
import {useSocketContext} from "../context/SocketContext";
import useSaveSession from "../hooks/useSaveSession";
import {useParams} from "react-router-dom";

const useTimer = (type) => {
  const {
    workMinutes,
    breakMinutes,
    countdownMinutes,
    isPaused,
    mode,
    isRunning,
    secondsLeft,
    setSecondsLeft,
    isStopWatchActive,
    isCountDownActive,
    timeElapsed,
    timeLeft,
    setIsPaused,
    setMode,
    setIsRunning,
    setIsStopWatchActive,
    setIsCountDownActive,
    setTimeElapsed,
    setTimeLeft,
    setWorkMinutes,
    setBreakMinutes,
    setCountdownMinutes,
    seshGoal,
    setShowRating,
  } = useStore((state) => ({
    timeElapsed: state.timeElapsed,
    setIsStopWatchActive: state.setIsStopWatchActive,

    timeLeft: state.timeLeft,
    setIsCountDownActive: state.setIsCountDownActive,
    setTimeElapsed: state.setTimeElapsed,
    //pomodoro
    seshGoal: state.seshGoal,
    setShowRating: state.setShowRating,
    mode: state.mode,
    setMode: state.setMode,
    isRunning: state.isRunning,
    setIsRunning: state.setIsRunning,
    seshGoal: state.seshGoal,
    setShowRating: state.setShowRating,
    secondsLeft: state.secondsLeft,
    setSecondsLeft: state.setSecondsLeft,
    breakMinutes: state.breakMinutes,
    setBreakMinutes: state.setBreakMinutes,
    workMinutes: state.workMinutes,
    setWorkMinutes: state.setWorkMinutes,
    isPaused: state.isPaused,
    setIsPaused: state.setIsPaused,

    isStopWatchActive: state.isStopWatchActive,
    isCountDownActive: state.isCountDownActive,
    setTimeLeft: state.setTimeLeft,
    countdownMinutes: state.countdownMinutes,
    setCountdownMinutes: state.setCountdownMinutes,
  }));

  const [loadedData, setLoadedData] = useState(false);
  const {key, authId} = useAuthId();
  const {socket} = useSocketContext();
  const {startSession} = useSaveSession();
  const {id: room} = useParams();

  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    console.log(type);
    if (type === "pomodoro" && isRunning && !isPaused) {
      setSecondsLeft(secondsLeft - 1);
    } else if (type === "countdown" && isCountDownActive) {
      setTimeLeft(timeLeft - 1);
    } else if (type === "stopwatch" && isStopWatchActive) {
      setTimeElapsed(timeElapsed + 1);
    }
  }, [
    type,
    secondsLeft,
    timeLeft,
    timeElapsed,
    isRunning,
    isPaused,
    isCountDownActive,
    isStopWatchActive,
    setSecondsLeft,
    setTimeLeft,
    setTimeElapsed,
  ]);

  useEffect(() => {
    // Retrieve necessary localStorage values
    const pausedTime = localStorage.getItem(`${key}PausedTime`);
    const storedStartTime = localStorage.getItem(`${key}startTime`);
    const storedIsRunning = localStorage.getItem(`${key}isRunning`);

    const workMinutes =
      parseInt(localStorage.getItem(`${key}workMinutes`)) || 60;
    const breakMinutes =
      parseInt(localStorage.getItem(`${key}breakMinutes`)) || 10;
    const mode = localStorage.getItem(`${key}mode`) || "work";

    setWorkMinutes(parseInt(workMinutes) || 60);
    setBreakMinutes(parseInt(breakMinutes) || 10);
    setMode(localStorage.getItem(`${key}mode`) || "work");
    setWorkMinutes(workMinutes);
    setBreakMinutes(breakMinutes);

    // if any ls value is null, set it to workMinutes
    // Calculate elapsedTime based on storedStartTime
    const elapsedTime = (Date.now() - storedStartTime) / 1000;

    // Calculate remainingTime using the correct values
    let remainingTime =
      (mode === "work" ? workMinutes : breakMinutes) * 60 - elapsedTime;
    if (storedStartTime == null) {
      remainingTime = workMinutes;
    }

    setIsPaused(localStorage.getItem(`${key}isPaused`) === "true");
    // Update state with the correct values
    setSecondsLeft(
      localStorage.getItem(`${key}isPaused`) === "true"
        ? pausedTime !== null
          ? pausedTime
          : (mode == "work" ? workMinutes : breakMinutes) * 60
        : remainingTime > 0
        ? remainingTime
        : workMinutes * 60
    );

    setIsRunning(storedIsRunning || false);
    setLoadedData(true);
  }, []);

  useEffect(() => {
    if (loadedData && type === "pomodoro") {
      if (isRunning && !isPaused) {
        intervalRef.current = setInterval(tick, 1000);
      } else {
        clearInterval(intervalRef.current);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [loadedData, type, tick, secondsLeft, timeElapsed, timeLeft]);

  useEffect(() => {
    if (loadedData && type === "countdown") {
      if (isCountDownActive) {
        intervalRef.current = setInterval(tick, 1000);
      } else {
        clearInterval(intervalRef.current);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [loadedData, type, tick, secondsLeft, timeElapsed, timeLeft]);

  useEffect(() => {
    if (loadedData && type === "stopwatch") {
      if (isStopWatchActive) {
        intervalRef.current = setInterval(tick, 1000);
      } else {
        clearInterval(intervalRef.current);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [loadedData, type, tick]);

  const start = useCallback(() => {
    if (type === "pomodoro") {
      if (!isRunning) localStorage.setItem(`${key}startTime`, Date.now());
      setIsRunning(true);
      setIsPaused(false);
      localStorage.setItem(`${key}isPaused`, "false");

      if (secondsLeft === workMinutes * 60) {
        startSession({
          room,
          duration: workMinutes,
          goal: seshGoal,
          id: authId,
        });
      } else if (secondsLeft !== workMinutes * 60 && mode === "work") {
        socket?.emit("paused-session", {
          id: localStorage.getItem(`${key}sessionID`),
          room,
          pause: false,
        });
      }
    } else if (type === "countdown") {
      setIsCountDownActive(true);
    } else if (type === "stopwatch") {
      setIsStopWatchActive(true);
    }
  }, [
    type,
    key,
    authId,
    room,
    isRunning,
    secondsLeft,
    workMinutes,
    mode,
    seshGoal,
    setIsRunning,
    setIsPaused,
    setIsCountDownActive,
    setIsStopWatchActive,
  ]);

  const pause = useCallback(() => {
    if (type === "pomodoro") {
      setIsPaused(true);
      localStorage.setItem(`${key}isPaused`, "true");
      localStorage.setItem(`${key}PausedTime`, secondsLeft);
      if (secondsLeft !== workMinutes * 60 && mode === "work") {
        socket?.emit("paused-session", {
          id: localStorage.getItem(`${key}sessionID`),
          room,
          pause: true,
        });
      }
    } else if (type === "stopwatch") {
      setIsStopWatchActive(false);
    } else {
      setIsCountDownActive(false);
    }
  }, [
    type,
    key,
    room,
    secondsLeft,
    workMinutes,
    mode,
    setIsPaused,
    setIsStopWatchActive,
    setIsCountDownActive,
  ]);

  const reset = useCallback(() => {
    if (type === "pomodoro") {
      localStorage.removeItem(`${key}startTime`);
      localStorage.removeItem(`${key}PausedTime`);
      setShowRating(false);
      if (mode === "work" && secondsLeft !== workMinutes * 60) {
        socket?.emit("reset-session", {
          id: localStorage.getItem(`${key}sessionID`),
          room,
        });
      }
      const resetSeconds =
        mode === "work" ? workMinutes * 60 : breakMinutes * 60;
      setSecondsLeft(resetSeconds);
      setIsRunning(false);
      setIsPaused(true);
      localStorage.setItem(`${key}isPaused`, "true");
    } else if (type === "countdown") {
      setTimeLeft(countdownMinutes * 60);
      setIsCountDownActive(false);
    } else if (type === "stopwatch") {
      setTimeElapsed(0);
      setIsStopWatchActive(false);
    }
  }, [
    type,
    key,
    room,
    mode,
    secondsLeft,
    workMinutes,
    breakMinutes,
    countdownMinutes,
    setShowRating,
    setSecondsLeft,
    setIsRunning,
    setIsPaused,
    setTimeLeft,
    setIsCountDownActive,
    setTimeElapsed,
    setIsStopWatchActive,
  ]);

  const toggle = useCallback(() => {
    const newMode = mode === "work" ? "break" : "work";
    setMode(newMode);
    if (!isPaused) localStorage.setItem(`${key}startTime`, Date.now());
    localStorage.setItem(`${key}mode`, newMode);
    const resetSeconds = (newMode === "work" ? workMinutes : breakMinutes) * 60;
    setSecondsLeft(resetSeconds);
  }, [key, mode, isPaused, workMinutes, breakMinutes, setMode, setSecondsLeft]);
  return {
    time:
      type === "pomodoro"
        ? secondsLeft
        : type === "countdown"
        ? timeLeft
        : timeElapsed,
    isRunning:
      type === "pomodoro"
        ? isRunning
        : type === "countdown"
        ? isCountDownActive
        : isStopWatchActive,
    start,
    pause,
    reset,
    setWorkMinutes,
    setBreakMinutes,
    setCountdownMinutes,
    workMinutes,
    breakMinutes,
    countdownMinutes,
    isStopWatchActive,
    setIsStopWatchActive,
    isCountDownActive,
    setTimeLeft,
    toggle,
    mode,
  };
};

export default useTimer;
