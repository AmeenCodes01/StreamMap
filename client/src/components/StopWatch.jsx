import React, { useState, useEffect } from 'react';

const Stopwatch = () => {
  const [timeElapsed, setTimeElapsed] = useState(
    parseInt(localStorage.getItem('stopwatchTimeElapsed')) || 0
  );
  const [isActive, setIsActive] = useState(
    localStorage.getItem('stopwatchIsActive') === 'true' || false
  );

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    } else {
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
  }
  
}
  return (
    <div onClick={onClick} className=''
    >
      <div>
        <p>{Math.floor(timeElapsed / 60)}:{('0' + (timeElapsed % 60)).slice(-2)}</p>
        <button className='btn btn-xs' onClick={startStopwatch}>Start</button>
        <button className='btn btn-xs'   onClick={pauseStopwatch}>Pause</button>
        <button className='btn btn-xs'  onClick={resetStopwatch}>Reset</button>
      </div>
    </div>
  );
};

export default Stopwatch;
