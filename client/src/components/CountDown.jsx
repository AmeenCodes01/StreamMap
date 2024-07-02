import React, {useState, useEffect} from "react";
import useStore from "../context/TimeStore";
import ProgressTimer from "./ProgressTimer";
import {IoIosSave} from "react-icons/io";
import {MdOutlineDownloadDone} from "react-icons/md";
import useAuthId from "../hooks/useAuthId";
import useTimer from "../hooks/useTimer";

const Timer = ({animate}) => {
  const {key} = useAuthId();
  // const [timeLeft, setTimeLeft] = useState(
  //   parseInt(localStorage.getItem(`${key}countdownTimeLeft`)) || 10
  // );
  // const [time, setTime] = useState(10);
  const [desc, setDesc] = useState("");
  //localStorage.getItem("timerIsActive") === "true" || false
const {isCountDownActive, time:timeLeft, start, pause, reset, setTimeLeft,
  countdownMinutes:time, setCountdownMinutes
} = useTimer("countdown")
  const [saved, setSaved] = useState(false);
  const {
    saveInSesh,

    //isCountDownActive,
    //setIsCountDownActive,
    isRunning,
  } = useStore((state) => ({
    saveInSesh: state.saveInSesh,
    isRunning:state.isRunning
    //isCountDownActive: state.isCountDownActive,
  
  }));


  const startTimer = () => {
   isCountDownActive ? pause(): start()
  };

  const pauseTimer = () => {
pause()
  };

  const resetTimer = () => {
    reset()
  };

  const saveCountdown = () => {
    timeLeft != 0 ? saveInSesh({time: time * 60 - timeLeft, desc}) : null;
    setSaved(true);
  };
  // const progress = ((time * 60 - timeLeft * 60) / (time * 60)) * 100;
  if (
    isCountDownActive &&
    timeLeft > 0 &&
    timeLeft !== time * 60 &&
    !isRunning
  ) {
    if (!saved) {
      console.log("inside saved, not saved");
    } else {
      console.log
    }
  }
  console.log(isRunning)
 console.log(isCountDownActive === false && timeLeft !== time*60 && isRunning && !saved ,"savecondition")
 //AD OPTION TO SET CUSTOM TIMER,save pref & keep it for next time ?
  return animate ? (
    <ProgressTimer time={timeLeft} progress={progress} />
  ) : (
    <div>
      <div>
        <div className="flex flex-row  justify-items-center items-center gap-[10px]">
          <p className="ml-auto mr-auto text-lg">
            {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)} 
          </p>
        </div>

        <div className="text-xs my-[10px] pl-[5px] flex flex-row justify-between  gap-[5px]">
       {  !isCountDownActive?
          <span>
            Set{"   "}
            <input
              onChange={(e) => {
                const regex = /^[0-9\b]+$/;
                if (e.target.value === "" || regex.test(e.target.value)) {
                  
                  setTimeLeft(e.target.value*60);
                  setCountdownMinutes(e.target.value)
                }
              }}
              className="w-[30px] px-[5px] py-[2px] ml-[5px] h-auto border-bottom border-1px text-center border-secondary focus:outline-none "
            />
            m
          </span>:null}
          <input
            className="w-[100px]   placeholder:text-xs h-auto border-bottom border-1px px-[5px] py-[2px] ml-[15px]  border-secondary focus:outline-none "
            placeholder="desc"
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-[10px] self-center items-center my-[20px]">
         
            <button className="btn btn-xs btn-secondary" onClick={startTimer}>
            {!isCountDownActive ?    "Play"     : "Pause"}
            </button>
      
          {/* <button className="btn btn-xs btn-secondary" onClick={pauseTimer}>
            Pause
          </button> */}
          <button className="btn btn-xs btn-secondary" onClick={resetTimer}>
            Reset
          </button>
          {
          isCountDownActive === false && timeLeft !== time*60 && isRunning ? (
            !saved ? (
              <button className=" items-center bg-0" onClick={saveCountdown}>
                <IoIosSave color="red" size={20} className="animate-pulse" />
              </button>
            ) : (
              <MdOutlineDownloadDone title="saved" />
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Timer);
