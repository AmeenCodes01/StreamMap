import React, {useEffect, useState} from "react";
import {IoIosSave} from "react-icons/io";
import {MdOutlineDownloadDone} from "react-icons/md";
import useStore from "../context/TimeStore";
import {setInterval, clearInterval} from "worker-timers";
import useAuthId from "../hooks/useAuthId";
import {useShallow} from "zustand/react/shallow";

const Stopwatch = () => {
  const {key} = useAuthId();
  const [desc, setDesc] = useState("");
  const {
    isStopWatchActive,
    setIsStopWatchActive,
    isRunning,
    setInSesh,
    stopWatchSaved, 
    setStopWatchSaved
  } = useStore(
    useShallow((state) => ({
      isStopWatchActive: state.isStopWatchActive,
      setIsStopWatchActive: state.setIsStopWatchActive,
      isRunning: state.isRunning,
      setInSesh: state.setInSesh,
      stopWatchSaved: state.stopWatchSaved, 
      setStopWatchSaved: state.setStopWatchSaved
    }))
  );

  const [timeElapsed, setTimeElapsed] = useState(
    parseInt(localStorage.getItem(`${key}stopwatchTimeElapsed`)) || 0
  );

  useEffect(() => {
    let interval;

    if (isStopWatchActive) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isStopWatchActive]);

  useEffect(()=>{
    localStorage.setItem(`${key}stopWatchSaved`, stopWatchSaved)
  }, [])

  useEffect(()=>{
    localStorage.setItem(`${key}stopWatchSaved`, stopWatchSaved)
  }, [stopWatchSaved])


  useEffect(() => {
    localStorage.setItem(`${key}stopwatchTimeElapsed`, timeElapsed);
  }, [timeElapsed]);

  const startStopwatch = () => {
    setIsStopWatchActive(true);
    localStorage.setItem(`${key}stopwatchIsActive`, isStopWatchActive);
  };

  const pauseStopwatch = () => setIsStopWatchActive(false);

  const resetStopwatch = () => {
    setIsStopWatchActive(false);
    setTimeElapsed(0);
    setSaved(false);
  };

  const saveStopwatch = () => {
    setInSesh({time: timeElapsed, desc: desc});
    setStopWatchSaved(true);
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
        <button
          className="btn btn-xs btn-secondary"
          onClick={!isStopWatchActive ? startStopwatch : pauseStopwatch}
        >
          {isStopWatchActive ? "Pause" : "Play"}
        </button>
        <button className="btn btn-xs btn-secondary" onClick={resetStopwatch}>
          Reset
        </button>
        {!isStopWatchActive && timeElapsed > 0 && isRunning ? (
          !stopWatchSaved ? (
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
