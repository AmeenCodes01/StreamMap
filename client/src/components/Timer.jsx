import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { LuTimerReset } from "react-icons/lu";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { useTimeContext } from "../context/TimeContext";
import useSaveSession from "../hooks/useSaveSession";
import { useParams } from "react-router-dom";
import { useSocketContext } from "../context/SocketContext";
import SepWindow from "./SepWindow";
import { useAuthContext } from "../context/AuthContext";

//

const red = "#f54e4e";
//save Starttime, calculate remaining time. delete upon completion
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
    setShowRating
  } = useTimeContext();


//   // const startTime = localStorage.getItem("startTime")  
//   // console.log(startTime,"start")
//   // const elapsedTime = (Date.now() - new Date (parseInt(startTime))) / 1000;
//  // console.log(elapsedTime,"elapsedTime")
//     // Calculate the remaining time
//     const startTime = localStorage.getItem("startTime")  
//     console.log(startTime,"start")
//     const elapsedTime = (Date.now() - new Date (parseInt(startTime))) / 1000;
//     const duration = (mode === "work" ? workMinutes * 60 : breakMinutes * 60)
//     let remainingTime = (parseInt(duration) - elapsedTime) 
//     remainingTime = remainingTime > 0 ? remainingTime : duration
    const [breakMinutes, setBreakMinutes] = useState(
      parseInt(localStorage.getItem("breakMinutes")) || 10
    );
    const [sessions, setSessions] = useState(
      parseInt(localStorage.getItem("sessions")) || 0
    );
    const { startSession, sessionID } = useSaveSession();
    
    const { authUser } = useAuthContext();

   // const remainingTime = ((mode === "work" ? workMinutes * 60 : breakMinutes * 60)) - elapsedTime;
    
    // console.log(localStorage.getItem("isRunning") === "true", "timer")
    // console.log(localStorage.getItem("isPaused"), "pausetimer")

    const { id: room } = useParams();
const intialTime = Number(localStorage.getItem("time") || (mode === "work" ? workMinutes * 60 : breakMinutes * 60) )
  const [secondsLeft, setSecondsLeft] = useState(
    intialTime
  )  
  console.log(isRunning && !isPaused,"conditions")
  const {socket} = useSocketContext()
  const toggle = mode === "break";
console.log(secondsLeft)
  function tick() {
    setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
    localStorage.setItem("time",secondsLeft-1)
  }
//get createdAt time. 
// useEffect(()=> {
//   const startTime = localStorage.getItem("startTime")  
//   console.log(startTime,"start")
//   const elapsedTime = (Date.now() - new Date (parseInt(startTime))) / 1000;
//   const duration = (mode === "work" ? workMinutes * 60 : breakMinutes * 60)
//   const remainingTime = parseInt(duration) - elapsedTime;
//   console.log(remainingTime,"remainnnnTIME")
//   console.log(elapsedTime,"ELAPSESTIME")
// if (remainingTime> 0 ){
//   console.log(remainingTime,"remainingTime")
//   setSecondsLeft(parseInt(remainingTime))
// }

// }
// ,[])
useEffect(() => {
  function switchMode() {
    const nextMode = mode === "work" ? "break" : "work";
     nextMode === "break" ? setShowRating(true): setShowRating(false)
    const nextSeconds =
      (nextMode === "work" ? workMinutes : breakMinutes) * 60;
    setSessions((prevSessions) => prevSessions + (mode === "work" ? 1 : 0));
    setMode(nextMode);
    setSecondsLeft(nextSeconds);
  }

  if (localStorage.getItem("isRunning") === "true") {
    const interval = setInterval(() => {
      if (!isPaused && secondsLeft > 0) {
        tick();
        //when session timer ends, progress asked only then. hidden while session ongoing. a new state. when session ends
      } else if (secondsLeft === 0) {
        switchMode();
      }
    }, 10); // Change interval to 1000 milliseconds (1 second)

    return () => clearInterval(interval);
  }
}, [workMinutes, breakMinutes, mode, isPaused, secondsLeft, isRunning]);


  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const onResetTimer = () => {

    setShowRating(false)
    mode === "work" && secondsLeft !== workMinutes*60 ? socket.emit("reset-session", {id:localStorage.getItem("sessionID"), room})
    : null
    const resetSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
    setSecondsLeft(resetSeconds);
    localStorage.removeItem("time")
  }
  const onToggle = () => {
    setMode(mode === "work" ? "break" : "work");
    const resetSeconds =
      (mode === "work" ? breakMinutes : workMinutes) * 60;
    setSecondsLeft(resetSeconds);
  };
console.log(  secondsLeft !== workMinutes*60 && mode ==="work", "CHECJ")
  return (
    <div className="w-[100%] flex flex-col pl-[10px]">
      {/* This will become a timer. */}
      <div className="flex flex-row">
        <p className="flex text-warning h-[30px] text-lg">{sessions}</p>
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
            {isPaused ? (
              <div className="flex flex-row gap-[10px]">
                <button
                  className="btn btn-success items-center justify-center"
                  onClick={() => {
                    setIsPaused(false);
                    setIsRunning(true);
                    localStorage.setItem("isRunning", "true")
                    localStorage.setItem("startTime", Date.now() )
                secondsLeft === workMinutes*60? startSession({room,duration:workMinutes,goal:seshGoal,id:authUser._id }) : null
               secondsLeft !== workMinutes*60 && mode ==="work" ?     socket.emit("paused-session", {id:localStorage.getItem("sessionID"), room, pause: false })
:null
                  }}
                >
                  <FaPlayCircle size={15} />
                </button>
                <button className="btn btn-primary" onClick={onResetTimer}>
                  <LuTimerReset size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsPaused(true);
                  setIsRunning(false);
                  secondsLeft !== workMinutes*60 && mode ==="work"?    
                        socket.emit("paused-session", {id:localStorage.getItem("sessionID"), room, pause: true }) : null
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
                    }}
                    max={120}
                    min={0}
                    step={5}
                    height={"10px"}
                    className="range range-success range-sm"
                  />
                  <span className="prose text-xs ">
                    Work :{" "}
                    <span className="text-info prose-lg ">{workMinutes} min</span>{" "}
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
        <SepWindow/>
      <div className="flex flex-row gap-[10px] text-bold self-center mb-[20px] rotate-360">
        <span className="text-xs self-center text-cente font-semibold">Work</span>
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
