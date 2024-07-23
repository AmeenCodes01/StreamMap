import React, {useEffect, useState, useRef} from "react";
import {CircularProgressbar, buildStyles} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {LuTimerReset} from "react-icons/lu";
import {FaPlayCircle, FaPauseCircle} from "react-icons/fa";
import useAuthId from "../hooks/useAuthId";
import {useShallow} from "zustand/react/shallow";
import {setInterval, clearInterval} from "worker-timers";
import useStore from "../context/TimeStore";
import usePomodoro from "../hooks/usePomodoro";
import timerEnd from "/timerEnd.mp3";
import useSaveSession from "../hooks/useSaveSession";
import InfoIcon from "./InfoIcon";
import { MdDeleteForever } from "react-icons/md";

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
    isCountDownActive,
    resetInSesh,
    rated,
    setRated,
    seshCount,
    setSeshCount,
    
  } = useStore(
    useShallow((state) => ({
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
      timeElapsed: state.timeElapsed,
      setTimeElapsed: state.setTimeElapsed,
      resetInSesh: state.resetInSesh,
      rated: state.rated,
      setRated: state.setRated,

      seshCount: state.seshCount,
      setSeshCount: state.setSeshCount,
    }))
  );
  const {authId, key, room} = useAuthId();
  const [disabled, setDisabled] = useState(false);
  const {start, pause} = usePomodoro();
  const audio = document.getElementById("audio_tag");
  const {resetSession} = useSaveSession();
  // check for sessionID, if exist, set true.
  useEffect(() => {
    // Retrieve necessary localStorage values
    const mode = localStorage.getItem(`${key}mode`) || "work";

    setWorkMinutes(parseInt(localStorage.getItem(`${key}workMinutes`)) || 60);
    setBreakMinutes(parseInt(localStorage.getItem(`${key}breakMinutes`)) || 10);

    const storedStartTime = localStorage.getItem(`${key}startTime`);

    const workMinutes =
      parseInt(localStorage.getItem(`${key}workMinutes`)) || 60;

    const breakMinutes =
      parseInt(localStorage.getItem(`${key}breakMinutes`)) || 10;
    
    const pausedTime =
      parseInt(localStorage.getItem(`${key}PausedTime`)) || mode==="work" ?workMinutes * 60 : breakMinutes*60
    

    setMode(mode);
    setWorkMinutes(workMinutes);
    setBreakMinutes(breakMinutes);
   // setRated(localStorage.getItem(`${key}rated`) === "true" || false);
    setSeshCount(parseInt(localStorage.getItem(`${key}seshCount`) )|| 0);
    //setDisabled(localStorage.getItem(`${key}disabled`) === "true" || false)

    const elapsedTime = (Date.now() - storedStartTime) / 1000;

    // Calculate remainingTime using the correct values
    let remainingTime =
      (mode == "work" ? workMinutes : breakMinutes) * 60 - elapsedTime;

    setIsPaused(
      remainingTime > 0
        ? localStorage.getItem(`${key}isPaused`) === "true"
        : true
    );

    setIsRunning(localStorage.getItem(`${key}isRunning`) === "true");
    // localStorage.getItem(`${key}sessionID`) !== null && mode === "break"
    //   ? setShowRating(true)
    //   : null;

    if (storedStartTime == null) {
      console.log("here")
      remainingTime = mode==="work" ?workMinutes * 60 : breakMinutes*60
      
    }

    if(mode==="break" && localStorage.getItem(`${key}sessionID`)!==null || mode==="work" && remainingTime<0 && localStorage.getItem(`${key}sessionID`)!==null &&       localStorage.getItem(`${key}isPaused`) !== "true"
  ){
  setShowRating(true)
  setDisabled(true)
  setRated(false)
    }

    // Update state with the correct values
console.log(mode,"mode", remainingTime, "remainingTime",pausedTime,"pause")
    setSecondsLeft(
      localStorage.getItem(`${key}isPaused`) === "true"
        ? pausedTime
        : remainingTime > 0
        ? remainingTime
        : mode==="work" ?workMinutes * 60 : breakMinutes*60
    );
  }, []);

  const toggle = mode === "break";

  function tick() {
    setSecondsLeft(secondsLeft - 1 < 0 ? 0 : secondsLeft - 1);
  }

  //get createdAt time.
  function switchMode() {
    audio.play();
    const nextMode = mode === "work" ? "break" : "work";
    nextMode === "break" ? setShowRating(true) : null;
    if (nextMode === "work" && rated === false) {
      setIsPaused(true);
      setDisabled(true);
    }


    const nextSeconds =
      (nextMode === "work" ? workMinutes : breakMinutes) * 60;
    
      mode === "work" ? setSeshCount(parseInt(seshCount) + 1) : null;
    setMode(nextMode);
    localStorage.setItem(`${key}mode`, nextMode);

    setSecondsLeft(nextSeconds);
    localStorage.setItem(`${key}startTime`, Date.now());
    if ((isStopWatchActive || isCountDownActive) && nextMode == "break") {
      setIsPaused(true);
      setDisabled(true);
      localStorage.setItem(`${key}PausedTime`, nextSeconds);
    }
  }


  useEffect(() => {
  

    if (isRunning) {
      const interval = setInterval(() => {
        if (!isPaused && secondsLeft > 0) {
          tick();
          //when session timer ends, progress asked only then. hidden while session ongoing. a new state. when session ends
        } else if (secondsLeft === 0) {
          switchMode();
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


  //reset timer when in break. If in work mode, reset session.
  const onResetTimer = (md) => {
    localStorage.removeItem(`${key}startTime`);
    localStorage.removeItem(`${key}PausedTime`);
    
    
    
    const resetSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
    if(mode ==="work" || md=="delete"){
      resetInSesh();
      setRated(false);
      setDisabled(false)
      setShowRating(false)
      secondsLeft !== resetSeconds  ? resetSession() : null;
    }
    
    setSecondsLeft(resetSeconds);
    setIsRunning(false);
    setIsPaused(true);
  };

  

//dont play next session until break. 
  
  
  const onToggle = () => {
    mode ==="break" && localStorage.getItem(`${key}sessionID`) !== null  ? setDisabled(true): null
    setMode(mode === "work" ? "break" : "work");
    localStorage.setItem(`${key}startTime`, Date.now());
    const resetSeconds = (mode === "work" ? breakMinutes : workMinutes) * 60;
    setSecondsLeft(resetSeconds);
    setIsPaused(true)
    setIsRunning(false)
    
  };





  useEffect(() => {
    if (!isCountDownActive && !isStopWatchActive && rated) {
      setDisabled(false);
    }
  }, [isCountDownActive, isStopWatchActive, rated]);

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

  useEffect(() => {
    localStorage.setItem(`${key}seshCount`, seshCount);
  }, [seshCount]);

  useEffect(() => {
    localStorage.setItem(`${key}rated`, rated);
  }, [seshCount]);

  useEffect(() => {
    localStorage.setItem(`${key}disabled`, disabled);
  }, [seshCount]);

  console.log((localStorage.getItem(`${key}sessionID`) === null))
  return (
    <div className="w-[100%] flex flex-col px-[10px]">
      {/* This will become a timer. */}
      <div className="flex flex-col">
        <div className="flex flex-row gap-[5px]">

        <input
          value={seshCount}
          onChange={(e) => {
            const regex = /^[0-9\b]+$/;
            if (
              (e.target.value === "" || regex.test(e.target.value)) 
            ) {
              setSeshCount(e.target.value);
            }
          }}
          className="w-[30px] flex text-warning h-[30px] text-lg px-[5px] py-[2px] ml-[5px] border-bottom border-1px text-center border-secondary focus:outline-none "
          />
   <div className="">
              <InfoIcon info="This timer will keep running even when tab closed :) "/>
             </div>
          </div>
        <div className=" mr-[10px] min-w-[100px] pt-[20px] ">
          <progress
            className={`progress w-[100%]   ${
              mode === "work" ? "progress-success" : "progress-error"
            }`}
            value={isNaN(percentage) ? 100 : 100 - percentage}
            max="100"
          ></progress>
        </div>
        <div className="flex flex-row-reverse space-between justify-between ">
          <div className="mt-[5px] flex flex-row">
             
            <span className="text-bold text-[50px] font-black ">
              {`${minutes < 10 ? "0" : ""}${minutes}:${
                seconds < 10 ? "0" : ""
              }${seconds}`}
            </span>
         
          </div>
          <div className=" mt-[5px]">
            <div>
              <div className="flex items-start justify-items-start flex-col ">
                <div className="flex flex-col p-[10px]">
                  {/* //Play button */}
                  {isPaused === true || isRunning === false ? (
                    <div className="flex flex-row gap-[10px]">
                      <button
                        disabled={mode==="break" ? false :disabled}
                        className="btn btn-success items-center justify-center"
                        //so I will start(room, workMinutes, )
                        onClick={() => {
                          secondsLeft === workMinutes * 60
                            ? start({
                                room,
                                duration: workMinutes,
                                goal: seshGoal,
                                userId: authId,
                              })
                            : start();
                        }}
                      >
                        <FaPlayCircle size={15} />
                      </button>{" "}
                      <button
                        className="btn btn-primary"
                        onClick={onResetTimer}
                      >
                        <LuTimerReset size={15} />
                      </button>
                    </div>
                  ) : null}

                  {isPaused == false && isRunning == true ? (
                    <button
                      className="btn btn-warning items-center justify-center"
                      onClick={() => {
                        pause();
                        // setIsPaused(true);
                        // setIsRunning(true);
                        // localStorage.setItem(`${key}PausedTime`, secondsLeft);
                        // localStorage.setItem(`${key}isRunning`, "true");

                        // secondsLeft !== workMinutes * 60 && mode === "work"
                        //   ? socket.emit("paused-session", {
                        //       id: localStorage.getItem(`${key}sessionID`),
                        //       room,
                        //       pause: true,
                        //     })
                        //   : null;
                      }}
                    >
                      <FaPauseCircle size={15} />
                    </button>
                  ) : null}

{ localStorage.getItem(`${key}sessionID`) !== null && mode ==="break" ?
<button className="btn btn-error my-[10px] h-[30px]" onClick={()=> onResetTimer("delete")}>

                  <MdDeleteForever size={25} />session
</button>
:null}
                </div>


                <div className="flex flex-col">
                  {isPaused && (
                    <>
                      <div className="h-[80px] px-[5px] items-center align-items-center p-[10px]">
                        <input
                          type="range"
                          value={workMinutes}
                          onChange={(e) => {
                            if (e.target.value > 0) {
                              setWorkMinutes(e.target.value);
                              mode === "work" &&
                                setSecondsLeft(e.target.value * 60);
                              localStorage.setItem(
                                `${key}workMinutes`,
                                e.target.value
                              );
                            }
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
                            if (e.target.value > 0) {
                              setBreakMinutes(e.target.value);
                              mode === "break" &&
                                setSecondsLeft(e.target.value * 60);
                              localStorage.setItem(
                                `${key}breakMinutes`,
                                e.target.value
                              );
                            }
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
            <audio id="audio_tag" src={timerEnd} />
            {(localStorage.getItem(`${key}sessionID`) === null) || !isRunning  ? (
              <div className="flex flex-row gap-[10px] text-bold self-start pl-[5px] mb-[20px] rotate-360">
                <span className="text-xs self-center text-cente font-semibold">
                  Work
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-xs"
                  checked={toggle}
                  onChange={onToggle}
                />
                <span className="text-xs self-center text-center font-semibold">
                  Break
                </span>
              </div>
            ):null}
          </div>
        </div>
      </div>

      {disabled && (
        <span className="text-xs italic text-warning">
          please rate the session and stop the countdown/stopwatch (if played)
        </span>
      )}
    </div>
  );
}
