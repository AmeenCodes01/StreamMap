import {useEffect, useState} from "react";
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
    setShowRating
  } = useStore((state) => ({
    timeElapsed: state.timeElapsed,
    setIsStopWatchActive: state.setIsStopWatchActive,
  
    timeLeft:state.timeLeft,
    setIsCountDownActive: state.setIsCountDownActive,
    setTimeElapsed: state.setTimeElapsed,
    //pomodoro
    seshGoal: state.seshGoal, 
    setShowRating:state.setShowRating,
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
    setCountdownMinutes:state.setCountdownMinutes
  }));


const {key,authId} = useAuthId()
const {socket} = useSocketContext();
const {startSession, sessionID} = useSaveSession();
const {id: room} = useParams();
const [loadedData, setLoadedData] = useState(false)

useEffect(() => {
  // Retrieve necessary localStorage values
  const pausedTime = localStorage.getItem(`${key}PausedTime`) 
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
  ? pausedTime !== null ? pausedTime :  (mode == "work" ? workMinutes : breakMinutes) * 60
  : remainingTime > 0
  ? remainingTime
  : workMinutes * 60
  );
  
  
 
  setIsRunning(storedIsRunning || false);
  setLoadedData(true)
}, []);


  // Update state with the correct values
  // Update state with the correct values
console.log( localStorage.getItem(`${key}isPaused`) ,"ISPAUSED")

  useEffect(() => {
    let interval;

    const tick = () => {
      if (type === "pomodoro") {
        console.log(secondsLeft)
        setSecondsLeft( secondsLeft - 1);
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
        if (type =="pomodoro" && isRunning && !isPaused){
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
    secondsLeft
  ]);

  useEffect(() => {
    if (type === "pomodoro" && secondsLeft === 0 && !isPaused) {
      (console.log("mode change"))
      const nextMode = mode === "work" ? "break" : "work";
      localStorage.setItem(`${key}mode`, mode === "work" ? "break" : "work");

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
    console.log(isPaused)
    localStorage.setItem(`${key}isPaused`, isPaused);
  
  }, [isPaused]);

  // useEffect(() => {
  //   localStorage.setItem(`${key}mode`, mode);
  //   console.log("mode",   localStorage.getItem(`${key}mode`))
  // }, [mode]);

  useEffect(() => {
    localStorage.setItem(`${key}isRunning`, isRunning);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem(`${key}secondsLeft`, secondsLeft);
  }, [secondsLeft]);

  // useEffect(() => {
  //   localStorage.setItem(`${key}workMinutes`, workMinutes);
  // }, [workMinutes]);

  // useEffect(() => {
  //   localStorage.setItem(`${key}breakMinutes`, breakMinutes);
  // }, [breakMinutes]);



  useEffect(() => {
    localStorage.setItem(`${key}isStopWatchActive`, isStopWatchActive);
  }, [isStopWatchActive]);

  

  useEffect(() => {
    localStorage.setItem(`${key}timeElapsed`, timeElapsed);
  }, [timeElapsed]);

 
  const start = () => {
    if (type === "pomodoro") {
      console.log("inside Start", isRunning,isPaused)
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
    if (type === "pomodoro"){
      
      setIsPaused(true);
      console.log("inside Pause", isRunning,isPaused)
      localStorage.setItem(`${key}PausedTime`, secondsLeft);
      secondsLeft !== workMinutes * 60 && mode === "work"
      ? socket.emit("paused-session", {
          id: localStorage.getItem(`${key}sessionID`),
          room,
          pause: true,
        })
      : null;

    }else  if (type==="stopwatch"){
      setIsStopWatchActive(false)
    }else{
      setIsCountDownActive(false)
    }
  
    }
    
  const reset = () => {
    if (type === "pomodoro") {
      console.log("inside Reset")
      localStorage.removeItem(`${key}startTime`);
      localStorage.removeItem(`${key}PausedTime`);
      setShowRating(false);
      mode === "work" && secondsLeft !== workMinutes * 60
        ? socket.emit("reset-session", {
            id: localStorage.getItem(`${key}sessionID`),
            room,
          })
        : null;
  
      const resetSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
      setSecondsLeft(resetSeconds);
      setIsRunning(false);
      setIsPaused(true);

    } else if (type === "countdown") {
      setTimeLeft(countdownMinutes * 60);
      setIsCountDownActive(false);
    } else if (type === "stopwatch") {
      setTimeElapsed(0);
      setIsStopWatchActive(false);
    }
  };

  const toggle = () => {
    setMode(mode === "work" ? "break" : "work");
    !isPaused && localStorage.setItem(`${key}startTime`, Date.now());
    localStorage.setItem(`${key}mode`, mode === "work" ? "break" : "work");

    const resetSeconds = (mode === "work" ? breakMinutes : workMinutes) * 60;
    setSecondsLeft(resetSeconds);
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
    setTimeLeft,
    toggle, 
    mode, 
    loadedData
  };
};

export default useTimer;
