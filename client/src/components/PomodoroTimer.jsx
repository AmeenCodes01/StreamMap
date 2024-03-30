import React, { useState, useEffect } from 'react';

const PomodoroTimer = ({ initialWorkMinutes = 1, initialBreakMinutes =1  }) => {
  const [minutes, setMinutes] = useState(() => {
    const localStorageMinutes = parseInt(localStorage.getItem('pomodoroMinLeft'));
    return Number.isNaN(localStorageMinutes) ? initialWorkMinutes : localStorageMinutes;
  });  const [seconds, setSeconds] = useState(parseInt(localStorage.getItem('pomodoroSecLeft')) || 0);
  const [isActive, setIsActive] = useState( localStorage.getItem('pomodoroActive') === 'true' || false
  );
  const [isBreak, setIsBreak] = useState(localStorage.getItem('pomodoroBreak') === 'true' || false);
  
  useEffect(() => {
    let interval;
  
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              clearInterval(interval);
              setIsActive(false);
              if (isBreak) {
                setMinutes(initialWorkMinutes);
                setIsActive(true)
              } else {
                setMinutes(initialBreakMinutes);
                setIsActive(true)
              }
              setIsBreak(!isBreak);
              return 0;
            } else {
              return 59;
            }
          } else {
            return prevSeconds - 1;
          }
        });
        setMinutes(prevMinutes => {
          if (prevMinutes === 0 && seconds === 0) {
            return prevMinutes;
          } else if (seconds === 0) {
            return prevMinutes - 1;
          } else {
            return prevMinutes;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
  
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, initialWorkMinutes, initialBreakMinutes, isBreak]);
  useEffect(() => {
    localStorage.setItem('pomodoroMinLeft', minutes);
    localStorage.setItem('pomodoroSecLeft', seconds);
    localStorage.setItem('pomodoroActive', isActive);
    localStorage.setItem('pomodoroBreak', isBreak);
  }, [isActive, seconds, minutes, isBreak]);
  
  // Add this useEffect to update `minutes` based on localStorage changes
  useEffect(() => {
    const localStorageMinutes = parseInt(localStorage.getItem('pomodoroMinLeft'));
    setMinutes(Number.isNaN(localStorageMinutes) ? initialWorkMinutes : localStorageMinutes);
  }, []);

  const toggleTimer = () => {
    setIsActive(!isActive);
    
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(initialWorkMinutes);
    setSeconds(0);
  };

  return (
    <div className='flex '>
      <div className='self-center flex-row  mr-auto flex gap-[10px] '>
        <button className=' btn btn-sm bg-accent'  onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</button>
        <button className=' btn btn-sm bg-neutral' onClick={resetTimer}>Reset</button>
      </div>
      <div className='flex flex-col'>

      <h1 className=' text-md '>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</h1>
      <h2 className='text-center self-end badge-xs py-[5px]  ml-auto badge badge-warning  '>{isBreak ? 'Break' : 'Work'}</h2>
      </div>
    </div>
  );
};

export default PomodoroTimer;
