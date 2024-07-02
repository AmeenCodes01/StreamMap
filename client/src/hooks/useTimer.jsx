import {useEffect} from "react";
import useStore from "../context/TimeStore";

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
  } = useStore((state) => ({
    timeElapsed: state.timeElapsed,
    setIsStopWatchActive: state.setIsStopWatchActive,
    setTimeElapsed: state.setTimeElapsed,
    workMinutes: state.workMinutes,
    setWorkMinutes: state.setWorkMinutes,
    isPaused: state.isPaused,
    setIsPaused: state.setIsPaused,
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
    isStopWatchActive: state.isStopWatchActive,
    isCountDownActive: state.isCountDownActive,
  }));
  console.log(timeElapsed, "timeElapsed");
  useEffect(() => {
    let interval;

    const tick = () => {
      if (type === "pomodoro") {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (type === "countdown") {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (type === "stopwatch") {
        setTimeElapsed(timeElapsed + 1); // Using the functional updater form
      }
    };

    if (
      (isRunning && type === "pomodoro") ||
      (isCountDownActive && type === "countdown") ||
      (isStopWatchActive && type === "stopwatch")
    ) {
      interval = setInterval(() => {
        if (!isPaused) {
          tick();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    isRunning,
    isCountDownActive,
    isStopWatchActive,
    isPaused,
    type,
    timeElapsed,
  ]);

  useEffect(() => {
    if (type === "pomodoro" && secondsLeft === 0 && !isPaused) {
      const nextMode = mode === "work" ? "break" : "work";
      const nextSeconds =
        (nextMode === "work" ? workMinutes : breakMinutes) * 60;
      setMode(nextMode);
      setSecondsLeft(nextSeconds);
    }
  }, [
    secondsLeft,
    type,
    isPaused,
    mode,
    workMinutes,
    breakMinutes,
    setMode,
    setSecondsLeft,
  ]);

  useEffect(() => {
    localStorage.setItem("workMinutes", workMinutes);
  }, [workMinutes]);

  useEffect(() => {
    localStorage.setItem("breakMinutes", breakMinutes);
  }, [breakMinutes]);

  useEffect(() => {
    localStorage.setItem("countdownMinutes", countdownMinutes);
  }, [countdownMinutes]);

  useEffect(() => {
    localStorage.setItem("isPaused", isPaused);
  }, [isPaused]);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("isRunning", isRunning);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem("secondsLeft", secondsLeft);
  }, [secondsLeft]);

  useEffect(() => {
    localStorage.setItem("isStopWatchActive", isStopWatchActive);
  }, [isStopWatchActive]);

  useEffect(() => {
    localStorage.setItem("isCountDownActive", isCountDownActive);
  }, [isCountDownActive]);

  useEffect(() => {
    localStorage.setItem("timeElapsed", timeElapsed);
  }, [timeElapsed]);

  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft);
  }, [timeLeft]);

  const start = () => {
    if (type === "pomodoro") {
      console.log("POMO");
      setIsRunning(true);
    } else if (type === "countdown") setIsCountDownActive(true);
    else if (type === "stopwatch") {
      setIsStopWatchActive(true);
    }
    setIsPaused(false);
  };

  const pause = () => setIsPaused(true);

  const reset = () => {
    setIsPaused(true);
    if (type === "pomodoro") {
      setSecondsLeft(mode === "work" ? workMinutes * 60 : breakMinutes * 60);
      setIsRunning(false);
    } else if (type === "countdown") {
      setTimeLeft(countdownMinutes * 60);
      setIsCountDownActive(false);
    } else if (type === "stopwatch") {
      setTimeElapsed(0);
      setIsStopWatchActive(false);
    }
  };

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
    isCountDownActive,
  };
};

export default useTimer;
