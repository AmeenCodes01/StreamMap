import React, { useState, useEffect } from "react";
import { useTimeContext } from "../context/TimeContext";
import ProgressTimer from "./ProgressTimer";

const Timer = ({animate }) => {
  const [timeLeft, setTimeLeft] = useState(
    parseInt(localStorage.getItem("timerTimeLeft")) || 10
  );
  const [time, setTime] = useState(10);
  const [desc, setDesc] = useState("");
  const [isActive, setIsActive] = useState( 
    localStorage.getItem("timerIsActive") === "true" || false
  );
  const { inSesh, setInSesh } = useTimeContext();
console.log(timeLeft)
  useEffect(() => {
    let interval;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      isActive
        ? setInSesh([...inSesh, { time: time * 60 - timeLeft, desc: desc }])
        : null;
        setIsActive(false)
      clearInterval(interval);
    }
    // setInSesh([...inSesh, { time: time * 60 - timeLeft, desc: desc }])
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    localStorage.setItem("timerTimeLeft", timeLeft);
    localStorage.setItem("timerIsActive", isActive);
  }, [timeLeft, isActive]);

  const startTimer = () => {
    setIsActive(true);
    setTimeLeft(time ? time * 60 : 10 * 60);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    timeLeft != 0
      ? setInSesh([...inSesh, { time: time * 60 - timeLeft, desc }])
      : null;
    setTimeLeft(time * 60 || 10 * 60);
  };
  
  const progress = (time*60 - timeLeft * 60) / (time * 60) * 100

  //AD OPTION TO SET CUSTOM TIMER,save pref & keep it for next time ?
  return (

    
      animate ? 
      <ProgressTimer time={timeLeft} progress={progress}/> :
    <div>
      <div>
      <div className='flex flex-row  justify-items-center items-center gap-[10px]'>

        <p className="ml-auto mr-auto text-lg" >
          {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
        </p>
       
</div>

        
        <div className="text-xs my-[10px] pl-[5px] flex flex-row justify-between  gap-[5px]">
          <span>
          Set{"   "} 
          <input
            onChange={(e) => {
              const regex = /^[0-9\b]+$/;
              if (e.target.value === "" || regex.test(e.target.value)) {
                setTimeLeft(e.target.value * 60);
                setTime(e.target.value);
              }
            }}
            className="w-[30px] px-[5px] py-[2px] ml-[5px] h-auto border-bottom border-1px text-center border-secondary focus:outline-none "
            />
          m
            </span>
          <input
            className="w-[100px]   placeholder:text-xs h-auto border-bottom border-1px px-[5px] py-[2px] ml-[15px]  border-secondary focus:outline-none "
            placeholder="desc"
            onChange={(e)=> setDesc(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-[10px] self-center items-center my-[20px]">

     { !isActive ?  <button className="btn btn-xs btn-secondary" onClick={startTimer}>
          Start
        </button>:null}
        <button className="btn btn-xs btn-secondary" onClick={pauseTimer}>
          Pause
        </button>
        <button className="btn btn-xs btn-secondary" onClick={resetTimer}>
          Reset
        </button>
        </div>
      </div>
    </div>
    
  )
  
};

export default Timer;
