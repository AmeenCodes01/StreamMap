import React, {useEffect, useState} from "react";
import {IoIosSave} from "react-icons/io";
import {MdOutlineDownloadDone} from "react-icons/md";
import useStore from "../context/TimeStore";
import useAuthId from "../hooks/useAuthId";
import useTimer from "../hooks/useTimer";

const Stopwatch = () => {
  // const {key} = useAuthId();
  const [desc, setDesc] = useState("");
  const {time: timeElapsed, start, pause, reset, 
    isStopWatchActive,    
  } = useTimer(
    "stopwatch"
  );
console.log("false")
  const {
    isRunning,
    saveInSesh,
  } = useStore((state) => ({
    isRunning: state.isRunning,
    saveInSesh: state.saveInSesh,
  }));

  // const [timeElapsed, setTimeElapsed] = useState(
  //   parseInt(localStorage.getItem(`${key}stopwatchTimeElapsed`)) || 0
  // );
  const [saved, setSaved] = useState(false);
useEffect(()=>{
console.log(timeElapsed)
}, [isStopWatchActive ])
  // useEffect(() => {
  //   let interval;

  //   if (isStopWatchActive) {
  //     interval = setInterval(() => {
  //       setTimeElapsed((prevTime) => prevTime + 1);
  //     }, 1000);
  //   } else {
  //     clearInterval(interval);
  //   }

  //   return () => clearInterval(interval);
  // }, [isStopWatchActive]);

//   useEffect(() => {
//   localStorage.setItem(`${key}stopwatchTimeElapsed`, timeElapsed);
// }, [timeElapsed]);

  const startStopwatch = () => {
    !isStopWatchActive ? start() : pause()
    // setIsStopWatchActive(true);
    // localStorage.setItem(`${key}stopwatchIsActive`, isStopWatchActive);
  };

  const pauseStopwatch = () => {
    pause();
    // setIsStopWatchActive(false);
  };

  const resetStopwatch = () => {
    reset();
    // setIsStopWatchActive(false);
    // setTimeElapsed(0);
  };

  const saveStopwatch = () => {
    saveInSesh({time: timeElapsed, desc: desc});
    setSaved(true);
  };



  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-items-center items-center">
        <p className="ml-auto mr-auto text-lg">
          {Math.floor(timeElapsed / 60)}:{("0" + (timeElapsed % 60)).slice(-2)}
        </p>
      </div>
      <input
        className="w-[100px] self-center placeholder:text-xs my-[10px] h-auto border-bottom border-1px px-[2px] ml-[15px] bg-base-100 border-secondary focus:outline-none"
        placeholder="desc"
        onChange={(e) => setDesc(e.target.value)}
      />
      <div className="flex flex-row gap-[10px] self-center items-center my-[20px]">
        {/* {!isStopWatchActive ? (
          <button className="btn btn-xs btn-secondary" onClick={startStopwatch}>
            Start
          </button>
        ) : null} */}
        <button className="btn btn-xs btn-secondary" onClick={startStopwatch}>
        {isStopWatchActive ? "Pause" : "Play"}
        </button>
        <button className="btn btn-xs btn-secondary" onClick={resetStopwatch}>
          Reset
        </button>
        {(!isStopWatchActive && timeElapsed > 0 )&& isRunning ? (
          !saved ? (
            <button className="items-center bg-0" onClick={saveStopwatch}>
              <IoIosSave color="red" size={20} className="animate-pulse" />
            </button>
          ) : (
            <MdOutlineDownloadDone title="saved" />
          )
        ) : null}
      </div>
    </div>
  );
};

export default Stopwatch;
