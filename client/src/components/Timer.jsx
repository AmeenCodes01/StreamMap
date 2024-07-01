import React, {useEffect, useState, useRef} from "react";
import {CircularProgressbar, buildStyles} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {LuTimerReset} from "react-icons/lu";
import {FaPlayCircle, FaPauseCircle} from "react-icons/fa";
import useSaveSession from "../hooks/useSaveSession";
import {useParams} from "react-router-dom";
import {useSocketContext} from "../context/SocketContext";
import useAuthId from "../hooks/useAuthId"

import {setInterval, clearInterval} from "worker-timers";
import  useStore  from "../context/TimeStore";
const red = "#f54e4e";

console.log("STARTTIME", localStorage.getItem("667e01a8ewfwefwe6a32269f54a5a106ShamsiastartTime"))
console.log("ELAPESTIME", (Date.now() -  localStorage.getItem("667e01a86a32269ferfre54a5a106ShamsiastartTime")) / 1000 )
//console.log("MODE,REMIAN",((localStorage.getItem(`667e01a86a32269f54a5a106Shamsiamode`) ==="work" ? workMinutes : breakMinutes) * 60) - elapsedTime; )
export default function Timer() {
 
  const {
    workMinutes,
    setWorkMinutes,
    isPaused,
    setIsPaused,
    mode,
    setMode,
    isRunning,
    setIsRunning,
    seshGoal,
    setShowRating,
    secondsLeft,
    setSecondsLeft,
    breakMinutes,
    setBreakMinutes,
    isStopWatchActive,
    isCountDownActive
    
   
  } = useStore(
    state =>({
      workMinutes:  state.workMinutes  ,
      setWorkMinutes: state.setWorkMinutes  ,
      isPaused: state.isPaused,
      setIsPaused: state.setIsPaused  ,
      mode: state.mode  ,
      setMode: state.setMode  ,
      isRunning: state.isRunning  ,
      setIsRunning: state.setIsRunning  ,
      seshGoal: state.seshGoal  ,
      setShowRating: state.setShowRating  ,
      secondsLeft: state.secondsLeft  ,
      setSecondsLeft: state.setSecondsLeft  ,
      breakMinutes: state.breakMinutes  ,
      setBreakMinutes: state.setBreakMinutes  ,
      isStopWatchActive: state.isStopWatchActive,
      isCountDownActive: state.isCountDownActive
      
    })
  );
  const {authId,key} = useAuthId()
  //   const elapsedTime = (Date.now() - localStorage.getItem(`${key}startTime`)) / 1000;
  
  //  const remainingTime = ((localStorage.getItem(`${key}mode`) === 'work' ? workMinutes : breakMinutes) * 60) - elapsedTime;
  // console.log(remainingTime,  elapsedTime, localStorage.getItem(`${key}startTime`)  )
  useEffect(() => {
    // Retrieve necessary localStorage values
    const pausedTime = localStorage.getItem(`${key}PausedTime`);
    setWorkMinutes(parseInt(localStorage.getItem(`${key}workMinutes`)) || 60);
    setBreakMinutes(parseInt(localStorage.getItem(`${key}breakMinutes`)) || 10);
    const storedStartTime = localStorage.getItem(`${key}startTime`);
    const storedIsRunning = localStorage.getItem(`${key}isRunning`);
    const workMinutes = parseInt(localStorage.getItem(`${key}workMinutes`)) || 60
    const breakMinutes = parseInt(localStorage.getItem(`${key}breakMinutes`)) || 10
    const mode = localStorage.getItem(`${key}mode`) || 'work'
   
    setMode(mode);
    setWorkMinutes(workMinutes)
    setBreakMinutes(breakMinutes)
   
   // if any ls value is null, set it to workMinutes
  // Calculate elapsedTime based on storedStartTime
  const elapsedTime =  (Date.now() - storedStartTime) / 1000 

  // Calculate remainingTime using the correct values
  let remainingTime = ((mode =="work" ? workMinutes  :  breakMinutes) * 60) - elapsedTime;
  if (storedStartTime == null ){
    
    remainingTime = workMinutes
  }
  setIsPaused(localStorage.getItem(`${key}isPaused`) === 'true');
  // Update state with the correct values
  setSecondsLeft((localStorage.getItem(`${key}isPaused`) === 'true')? pausedTime :  remainingTime > 0 ? remainingTime:workMinutes*60 );
  setIsRunning(storedIsRunning || false);
}, []);

  //console.log(localStorage.getItem(`${key}workMinutes`),"timer")
  // console.log(
    
  // )
  // console.log(secondsLeft,localStorage.getItem(`${key}isPaused`) )
  // console.log( parseInt(localStorage.getItem(`${key}workMinutes`)) )
  // console.log(secondsLeft, elapsedTime, intialTime)
  const {id: room} = useParams();

  
  const [sessions, setSessions] = useState(
    parseInt(localStorage.getItem(`${key}sessions`)) || 0
    );
    
    const {startSession, sessionID} = useSaveSession();
    
   
  const {socket} = useSocketContext();

  const toggle = mode === "break";

  function tick() {

    setSecondsLeft(secondsLeft - 1);
  }
  
  //get createdAt time.  

  useEffect(() => {
    function switchMode() {
      const nextMode = mode === "work" ? "break" : "work";
      nextMode === "break" ? setShowRating(true) : setShowRating(false);
      const nextSeconds =
        (nextMode === "work" ? workMinutes : breakMinutes) * 60;
      setSessions((prevSessions) => {
        return parseInt(prevSessions) + (mode === "work" ? 1 : 0);
      });

      setMode(nextMode);
      localStorage.setItem(`${key}mode`, nextMode);

      setSecondsLeft(nextSeconds);
      localStorage.setItem(`${key}startTime`, Date.now());
    }

    if (localStorage.getItem(`${key}isRunning`) === "true") {
      const interval = setInterval(() => {
       
        if (!isPaused && secondsLeft > 0) {
          tick();
          //when session timer ends, progress asked only then. hidden while session ongoing. a new state. when session ends
        
        } else if (secondsLeft === 0 ) {
          if ((isStopWatchActive || isCountDownActive)){
            setIsPaused(true)
            
            setIsRunning(false)
          }
             switchMode() 
         // localStorage.removeItem(`${key}startTime`);
        }
      }, 1000); // Change interval to 1000 milliseconds (1 second)

      return () => clearInterval(interval);
    }
  }, [workMinutes, breakMinutes, mode, isPaused, secondsLeft, isRunning]);

  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = Math.floor(secondsLeft % 60);
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);
  
  const onResetTimer = () => {
    localStorage.removeItem(`${key}startTime`);
    setShowRating(false);
    mode === "work" && secondsLeft !== workMinutes * 60
      ? socket.emit("reset-session", {
          id: localStorage.getItem(`${key}sessionID`),
          room,
        })
      : null;

    const resetSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
   setSecondsLeft(resetSeconds);
    setIsRunning(false)
    setIsPaused(true)
   
    // localStorage.removeItem(`${key}time`);
  };

  const onToggle = () => {
    setMode(mode === "work" ? "break" : "work");
    localStorage.setItem(`${key}startTime`,Date.now());
    console.log( localStorage.getItem(`${key}startTime`),"toggleStartTime")
    const resetSeconds = (mode === "work" ? breakMinutes : workMinutes) * 60;
   setSecondsLeft(resetSeconds);
 
  };

//get all & set. seconds, isRunning, 


useEffect(() => {
  localStorage.setItem(`${key}isPaused`, isPaused);
}, [isPaused]);

useEffect(() => {
localStorage.setItem(`${key}isRunning`, isRunning);
}, [isRunning]);


useEffect(() => {
  localStorage.setItem(`${key}mode`, mode);
  }, [mode]);
  
useEffect(() => {
  localStorage.setItem(`${key}workMinutes`, workMinutes);
}, [workMinutes]);

useEffect(() => {
  localStorage.setItem(`${key}breakMinutes`, breakMinutes);
}, [breakMinutes]);

  return (
    <div className="w-[100%] flex flex-col pl-[10px]">
      {/* This will become a timer. */}
      <div className="flex flex-row">
        <input
          value={sessions}
          onChange={(e) => {
            const regex = /^[0-9\b]+$/;
            if (
              (e.target.value === "" || regex.test(e.target.value)) &&
              e.target.value <= 10
            ) {
              setSessions(e.target.value);
            }
          }}
          className="w-[30px] flex text-warning h-[30px] text-lg px-[5px] py-[2px] ml-[5px] border-bottom border-1px text-center border-secondary focus:outline-none "
        />

        <div className="w-[500px] mr-[10px] min-w-[100px]">
          <CircularProgressbar
            value={percentage}
            strokeWidth={30}
            text={`${minutes < 10 ? "0" : ""}${minutes}:${
              seconds < 10 ? "0" : ""
            }${seconds}`}
            styles={buildStyles({
              strokeLinecap: "butt",
              textSize: "16px",
              pathTransitionDuration: 0.5,
              pathColor:
                mode === "work" ? "oklch(var(--su))" : "oklch(var(--er))",
              textColor: "oklch(var(--nc))",
              trailColor: "#d6d6d6",
              tailColor: red,
            })}
          />
        </div>
        <div className="flex items-center justify-items-center flex-col">
          <div className="flex flex-col p-[10px]">
            {isPaused && (!isStopWatchActive && !isCountDownActive) ? (
              <div className="flex flex-row gap-[10px]">
                <button
                  className="btn btn-success items-center justify-center"
                  onClick={() => {
                  !isRunning ?   localStorage.setItem(`${key}startTime`, Date.now()) : null
                  console.log( localStorage.getItem(`${key}startTime`),"playStart")
                    setIsPaused(false);
                    setIsRunning(true);

                    secondsLeft === workMinutes * 60
                      ? startSession({
                          room,
                          duration: workMinutes,
                          goal: seshGoal,
                          id:   authId
,
                        })
                      : null;
                    secondsLeft !== workMinutes * 60 && mode === "work"
                      ? socket.emit("paused-session", {
                          id: localStorage.getItem(`${key}sessionID`),
                          room,
                          pause: false,
                        })
                      : null;
                  }}
                >
                  <FaPlayCircle size={15} />
                </button>
                {
                   (!isStopWatchActive && !isCountDownActive) ? <button className="btn btn-primary" onClick={onResetTimer}>
                  <LuTimerReset size={15} />
                </button> : null}
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsPaused(true);
                  
                  //setIsRunning(true);
                  localStorage.setItem(`${key}PausedTime`, secondsLeft);
                //  localStorage.setItem(`${key}isRunning`, "true");

                  secondsLeft !== workMinutes * 60 && mode === "work"
                    ? socket.emit("paused-session", {
                        id: localStorage.getItem(`${key}sessionID`),
                        room,
                        pause: true,
                      })
                    : null;
                }}
                className="btn btn-warning items-center justify-center"
              >
                <FaPauseCircle size={15} />
              </button>
            )}
          </div>
          <div className="flex flex-col">
            {isPaused && (
              <>
                <div className="h-[80px] px-[5px] items-center align-items-center p-[10px]">
                  <input
                    type="range"
                    value={workMinutes}
                    onChange={(e) => {
                      setWorkMinutes(e.target.value);
                      mode === "work" && setSecondsLeft(e.target.value * 60);
                      localStorage.setItem(`${key}workMinutes`, e.target.value);
                    }}
                    max={120}
                    min={0}
                    // step={5}
                    height={"10px"}
                    className="range range-success range-sm"
                  />
                  <span className="prose text-xs ">
                    Work :{" "}
                    <span className="text-info prose-lg ">
                      {workMinutes} min
                    </span>{" "}
                  </span>
                </div>
                <div className="h-[80px] px-[5px] items-center align-items-center p-[10px]">
                  <input
                    type="range"
                    min={0}
                    value={breakMinutes}
                    onChange={(e) => {
                      setBreakMinutes(e.target.value);
                      mode === "break" && setSecondsLeft(e.target.value * 60);
                      localStorage.setItem(`${key}breakMinutes`, e.target.value);

                    }}
                    max={120}
                    step={5}
                    className="range range-error range-sm"
                    height={"10px"}
                  />
                  <span className="prose text-xs">
                    Break :{" "}
                    <span className="text-error prose-lg ">
                      {breakMinutes} min
                    </span>{" "}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

       <div className="flex flex-row gap-[10px] text-bold self-center mb-[20px] rotate-360">
        <span className="text-xs self-center text-cente font-semibold">
          Work
        </span>
        <input
          type="checkbox"
          className="toggle  toggle-xs"
          checked={toggle}
          onChange={onToggle}
        />
        <span className="text-xs self-center text-center font-semibold">
          Break
        </span>
      </div> 
    </div>
  );
}



//  authId: "",
//     setAuthId: (id) => set({id}),
//     room: "", 
//     setRoom: (room) => set({room}),