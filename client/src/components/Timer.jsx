import React, { useRef, useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Range } from "react-daisyui";

import Sessions from "./Sessions";
import { LuTimerReset } from "react-icons/lu";
import { CiPlay1 } from "react-icons/ci";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import SleepTracker from "../components/SleepTimer";
import MoodTracker from "../components/MoodTracker";
import PomodoroTimer from "./PomodoroTimer";

const red = "#f54e4e";
const green = "#4aec8c";

export default function Timer() {
  const [workMinutes, setWorkMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(15);
  const [sessions, setSessions] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work"); // work/break/null
  const [secondsLeft, setSecondsLeft] = useState(0);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  useEffect(() => {
    function switchMode() {
      const nextMode = modeRef.current === "work" ? "break" : "work";
      const nextSeconds =
        (nextMode === "work" ? workMinutes : breakMinutes) * 60;
      modeRef.current === "work" ? setSessions(sessions + 1) : null;
      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }

    secondsLeftRef.current = workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    }, 100);

    return () => clearInterval(interval);
  }, [workMinutes, breakMinutes]);

  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  const onResetTimer = () => {
    mode === "work"
      ? setSecondsLeft(workMinutes * 60)
      : setSecondsLeft(breakMinutes * 60);

    // secondsLeftRef = workMinutes*60
    // percentage = 100 
  };
  return (
    <div className=" w-[100%]  flex flex-col pl-[10px]  ">

      {/* This will become a timer.  */}
      <div className="  flex flex-row  ">
        <p className="flex text-warning h-[30px] text-lg "> {sessions} </p>
<div           className=" w-[500px] mr-[10px] min-w-[100px]  ">

        <CircularProgressbar
          value={percentage}
          strokeWidth={30}
          
          text={`${minutes < 10 ? "0" : ""}${minutes}:${seconds}`}
          styles={buildStyles({
            strokeLinecap: 'butt',

            // Text size
            textSize: '16px',
        
            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0.5,
        
            // Can specify path transition in more detail, or remove it entirely
            // pathTransition: 'none',
        
            // Colors
            pathColor: `oklch(var(--p))`,
            textColor: 'oklch(var(--nc))',
            trailColor: '#d6d6d6',
            backgroundColor: '#3e98c7',
            // pathColor: mode === "work" ? green : red,
            tailColor: red,
          })}
        />
</div>
<div className=" flex items-center justify-items-center flex-col  ">
  <div className="flex flex-col p-[10px]">

        {isPaused ? (
          <div className="flex flex-row gap-[10px]">
            <button
              className="btn btn-success  items-center justify-center "
              onClick={() => {
                setIsPaused(false);
                isPausedRef.current = false;
              }}
            >
              <FaPlayCircle size={15} className="" />
            </button>
            {/* <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false; }} /> */}
            <button
              className="btn btn-primary "
              onClick={onResetTimer}
            >
              <LuTimerReset size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsPaused(true);
              isPausedRef.current = true;
            }}
            className="btn btn-warning  items-center justify-center "
            >
            <FaPauseCircle size={15} />
          </button>
        )}
  </div>
      <div className=" flex flex-col">

      {isPaused ? (
        <div className="flex flex-col">
        
          <div className="h-[80px] px-[5px] items-center align-items-center  p-[10px]">
            {/* <Range
              value={workMinutes}
              onChange={(e) => setWorkMinutes(e.target.value)}
              max={120}
              height={"10px"}
              className=" range-success  mt-[20px]"
            /> */}
            <input
              type="range"
              value={workMinutes}
              onChange={(e) => setWorkMinutes(e.target.value)}
              max={120}
              min={0}
              height={"10px"}
              className=" range range-success  range-sm"
            />
            <span className="prose text-xs">
                  Work :{" "}
                  <span className="text-info prose-lg "> {workMinutes} min</span>{" "}
                </span>
          </div>
          <div className="h-[80px] px-[5px] items-center align-items-center p-[10px]">

            <input  
              type="range"
              min={0}
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(e.target.value)}
              max={120}
              className="range range-error range-sm"
              height={"10px"}
            />

            <span className="prose text-xs">
              Break :{" "}
              <span className="text-error prose-lg "> {breakMinutes} min</span>{" "}
            </span>
          </div>
        </div>
      ) : null}
</div>
      </div>
      {/* <button onClick={handleClick}>{pause ? "Run" : "Pause"}</button> */}
</div>
<div className="flex flex-row  w-[100%] justify-between pl-[25px] pr-[10px] mt-[50px]">

<MoodTracker/>
<SleepTracker/>
</div>
        <Sessions mode={mode} isPaused={isPaused} duration={workMinutes} />
    
    </div>
  );
}



//Refactor this. Timer logic same but will return different components, Circle for user & for stream timer, it will show simple countdown ?  So the logic will be the same but returned comp diff, lets gooo. 