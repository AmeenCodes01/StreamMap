import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(
    parseInt(localStorage.getItem('timerTimeLeft')) || 0
  );
  const [isActive, setIsActive] = useState(
    localStorage.getItem('timerIsActive') === 'true' || false
  );

  useEffect(() => {
    let interval;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    localStorage.setItem('timerTimeLeft', timeLeft);
    localStorage.setItem('timerIsActive', isActive);
  }, [timeLeft, isActive]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  return (
    <div>
      <div>
        <p>{Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</p>
        <button className='btn btn-xs'  onClick={() => setTimeLeft(5 * 60)}>Set 5 Minutes</button>
        <button className='btn btn-xs' onClick={() => setTimeLeft(10 * 60)}>Set 10 Minutes</button>
        <button className='btn btn-xs' onClick={startTimer}>Start</button>
        {/* <button onClick={pauseTimer}>Pause</button> */}
        <button  className='btn btn-xs'  onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default Timer;
