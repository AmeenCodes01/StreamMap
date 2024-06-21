import React, { useState, useEffect } from 'react';
import { useTimeContext } from "../context/TimeContext";

const Stopwatch = () => {


  const [desc, setDesc] = useState();

  const [timeElapsed, setTimeElapsed] = useState(
    parseInt(localStorage.getItem('stopwatchTimeElapsed')) || 0
  );
  const [isActive, setIsActive] = useState(
    localStorage.getItem('stopwatchIsActive') === 'true' || false
  );
      const {inSesh, setInSesh} = useTimeContext()
  
      useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setIsActive(false)
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    localStorage.setItem('stopwatchTimeElapsed', timeElapsed);
    localStorage.setItem('stopwatchIsActive', isActive);
  }, [timeElapsed, isActive]);

  const startStopwatch = () => {
    setIsActive(true);
  };

  const pauseStopwatch = () => {
    setIsActive(false);
  };

  const resetStopwatch = () => {
    setIsActive(false);
    setTimeElapsed(0);
    setInSesh([...inSesh, {time:timeElapsed, desc:desc }])

  };

  
const onClick = ()=> {
  if (!isActive){
    startStopwatch()
  }
  if(isActive){
    pauseStopwatch()
  }  
  if (!isActive && timeElapsed !==0){
    resetStopwatch()
    //display a box asking if to save or not. or modal ?
  }
  
}
  return (
    <div
    //  onClick={onClick} 
     className='flex flex-col'
    >
      
        <div className='flex flex-row  justify-items-center items-center '>

        <p className="ml-auto mr-auto text-lg">{Math.floor(timeElapsed / 60)}:{('0' + (timeElapsed % 60)).slice(-2)}</p>
        </div>
        <input
            className="w-[100px] self-center placeholder:text-xs my-[10px] h-auto border-bottom border-1px px-[2px] ml-[15px] bg-base-100 border-secondary focus:outline-none "
            placeholder="desc"
            onChange={(e)=> setDesc(e.target.value)}
          />
           <div className="flex flex-row gap-[10px] self-center items-center my-[20px]">
           { !isActive ?      <button className='btn btn-xs btn-secondary' onClick={startStopwatch}>Start</button> :null}
        <button className='btn btn-xs btn-secondary'   onClick={pauseStopwatch}>Pause</button>
        <button className='btn btn-xs btn-secondary'  onClick={resetStopwatch}>Reset</button>
        </div>
    </div>
  );
};

export default Stopwatch;
