import {useEffect} from "react";
import useStore from "../context/TimeStore";
import useAuthId from "./useAuthId";
import {setInterval, clearInterval} from "worker-timers";
import {useSocketContext} from "../context/SocketContext";
import useSaveSession from "../hooks/useSaveSession";

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

    timeLeft:state.timeLeft,
    setIsCountDownActive: state.setIsCountDownActive,
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
    setTimeLeft: state.setTimeLeft,
    countdownMinutes: state.countdownMinutes, 
    setCountdownMinutes:state.setCountdownMinutes
  }));

const {key} = useAuthId()
const {socket} = useSocketContext();

useEffect(() => {
  // Retrieve necessary localStorage values
  const pausedTime = localStorage.getItem(`${key}PausedTime`) 
  setWorkMinutes(parseInt(localStorage.getItem(`${key}workMinutes`)) || 60);
  setBreakMinutes(parseInt(localStorage.getItem(`${key}breakMinutes`)) || 10);
  const storedStartTime = localStorage.getItem(`${key}startTime`);
  const storedIsRunning = localStorage.getItem(`${key}isRunning`);
  const workMinutes =
  parseInt(localStorage.getItem(`${key}workMinutes`)) || 60;
  const breakMinutes =
  parseInt(localStorage.getItem(`${key}breakMinutes`)) || 10;
  const mode = localStorage.getItem(`${key}mode`) || "work";
  
  
  setMode(mode);
  setWorkMinutes(workMinutes);
  setBreakMinutes(breakMinutes);

  // if any ls value is null, set it to workMinutes
  // Calculate elapsedTime based on storedStartTime
  const elapsedTime = (Date.now() - storedStartTime) / 1000;

  // Calculate remainingTime using the correct values
  let remainingTime =
    (mode == "work" ? workMinutes : breakMinutes) * 60 - elapsedTime;
  if (storedStartTime == null) {
    remainingTime = workMinutes;
  }
  
  setIsPaused(localStorage.getItem(`${key}isPaused`) === "true");
  // Update state with the correct values
  setSecondsLeft(
    localStorage.getItem(`${key}isPaused`) === "true"
  ? pausedTime !== null ? pausedTime :  (mode == "work" ? workMinutes : breakMinutes) * 60
  : remainingTime > 0
  ? remainingTime
  : workMinutes * 60
  );
  
  
 
  setIsRunning(storedIsRunning || false);
}, []);

  useEffect(() => {
    let interval;

    const tick = () => {
      if (type === "pomodoro") {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (type === "countdown") {
        setTimeLeft(timeLeft  - 1 );
      } else if (type === "stopwatch") {
        setTimeElapsed(timeElapsed + 1); // Using the functional updater form
      }
    };

  

    
    // if (
      //   (isRunning && type === "pomodoro") ||
      //   (isCountDownActive && type === "countdown") ||
      //   (isStopWatchActive && type === "stopwatch")
      // ) {
        if(type ==="stopwatch" && isStopWatchActive){
          interval = setInterval(() => {
           
              tick();
            
          }, 1000);    
        }
        if (type ==="countdown" && isCountDownActive){
          interval = setInterval(() => {

            tick();
          
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
    timeLeft, 
    
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
    timeLeft
  ]);

useEffect(()=>{
  //STOP WATCH
  setIsStopWatchActive(localStorage.getItem(`${key}isStopWatchActive`) === "true");
  setTimeElapsed(parseInt(localStorage.getItem(`${key}timeElapsed`)))
  
  setCountdownMinutes(parseInt(localStorage.getItem(`${key}countdownMinutes`)) || 10)
  setTimeLeft(parseInt(localStorage.getItem(`${key}timeLeft`)) === 0 ? 10*60 :parseInt(localStorage.getItem(`${key}timeLeft`)))
  setIsCountDownActive(localStorage.getItem(`${key}isCountDownActive`) == "true")
}, [])

console.log(parseInt(localStorage.getItem(`${key}timeLeft`)))
console.log( Math.floor(timeLeft / 60),("0" + (timeLeft % 60)).slice(-2))


//  COUNTDOWN
  useEffect(() => {
    localStorage.setItem(`${key}countdownMinutes`, countdownMinutes);
  }, [countdownMinutes]);

  useEffect(() => {
    localStorage.setItem(`${key}timeLeft`, timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem(`${key}isCountDownActive`, isCountDownActive);
  }, [isCountDownActive]);

//POMODORO
  useEffect(() => {
    localStorage.setItem(`${key}isPaused`, isPaused);
  }, [isPaused]);

  useEffect(() => {
    localStorage.setItem(`${key}mode`, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(`${key}isRunning`, isRunning);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem(`${key}secondsLeft`, secondsLeft);
  }, [secondsLeft]);

  useEffect(() => {
    localStorage.setItem(`${key}workMinutes`, workMinutes);
  }, [workMinutes]);

  useEffect(() => {
    localStorage.setItem(`${key}breakMinutes`, breakMinutes);
  }, [breakMinutes]);



  useEffect(() => {
    localStorage.setItem(`${key}isStopWatchActive`, isStopWatchActive);
  }, [isStopWatchActive]);

  

  useEffect(() => {
    localStorage.setItem(`${key}timeElapsed`, timeElapsed);
  }, [timeElapsed]);

 
  const start = () => {
    if (type === "pomodoro") {
      !isRunning
      ? localStorage.setItem(`${key}startTime`, Date.now())
      : null;
      setIsRunning(true);
      setIsPaused(false);
      secondsLeft === workMinutes * 60
                      ? startSession({
                          room,
                          duration: workMinutes,
                          goal: seshGoal,
                          id: authId,
                        })
                      : null;
                    secondsLeft !== workMinutes * 60 && mode === "work"
                      ? socket.emit("paused-session", {
                          id: localStorage.getItem(`${key}sessionID`),
                          room,
                          pause: false,
                        })
                      : null;
    } else if (type === "countdown"){

      setIsCountDownActive(true);
       
      }
    else if (type === "stopwatch") {
      
      setIsStopWatchActive(true);
    }
  };

  const pause = () => {
    if (type === "pomodoo"){
      setIsPaused(true);
    }else  if (type==="stopwatch"){
      setIsStopWatchActive(false)
    }else{
      setIsCountDownActive(false)
    }
  
    }
    
  const reset = () => {
    if (type === "pomodoro") {
      setSecondsLeft(mode === "work" ? workMinutes * 60 : breakMinutes * 60);
      setIsPaused(true);
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
    setIsStopWatchActive,
    isCountDownActive,
    setTimeLeft
  };
};

export default useTimer;
