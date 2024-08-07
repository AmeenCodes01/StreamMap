import React, {useState, useEffect} from "react";
import useStore from "../context/TimeStore";
import {IoIosSave} from "react-icons/io";
import {MdOutlineDownloadDone} from "react-icons/md";
import useAuthId from "../hooks/useAuthId";
import {setInterval, clearInterval} from "worker-timers";
import {useShallow} from "zustand/react/shallow";

const Timer = ({animate}) => {
  const {key} = useAuthId();
  const [timeLeft, setTimeLeft] = useState(
    parseInt(localStorage.getItem(`${key}countdownTimeLeft`)) || 10 * 60
  );
  const [desc, setDesc] = useState("");
  const {
    setInSesh,
    isCountDownActive,
    setIsCountDownActive,
    isRunning,
    setCountdownMinutes,
    countdownMinutes,
    countDownSaved,
    setCountDownSaved 
  } = useStore(
    useShallow((state) => ({
      setInSesh: state.setInSesh,
      isCountDownActive: state.isCountDownActive,
      setIsCountDownActive: state.setIsCountDownActive,
      isRunning: state.isRunning,
      setCountdownMinutes: state.setCountdownMinutes,
      countdownMinutes: state.countdownMinutes,
      countDownSaved: state.countDownSaved, 
      setCountDownSaved: state.setCountDownSaved
    }))
  );

useEffect(()=>{
setCountDownSaved(localStorage.getItem(`${key}countDownSaved`) ==="true" || false)
},[])

  useEffect(() => {
    setIsCountDownActive(
      localStorage.getItem(`${key}isCountDownActive`) == "true"
    );
  }, []);


  useEffect(() => {
    let interval;

    if (isCountDownActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      //when timer ends, do nothing
      setIsCountDownActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCountDownActive, timeLeft]);

  useEffect(() => {
    localStorage.setItem(`${key}countdownTimeLeft`, timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem(`${key}isCountDownActive`, isCountDownActive);
  }, [isCountDownActive]);
  
  useEffect(() => {
    localStorage.setItem(`${key}countDownSaved`, countDownSaved);
  }, []);

  useEffect(() => {
    localStorage.setItem(`${key}countDownSaved`, countDownSaved);
  }, [countDownSaved]);

  const startTimer = () => {
    setIsCountDownActive(true);
  };

  const pauseTimer = () => {
    setIsCountDownActive(false);
  };

  const resetTimer = () => {
    setIsCountDownActive(false);
    setCountDownSaved(false);
    setTimeLeft(countdownMinutes * 60 || 10 * 60);
  };

  const saveCountdown = () => {
    timeLeft != 0
      ? setInSesh({time: countdownMinutes * 60 - timeLeft, desc})
      : null;
    setCountDownSaved(true);
  };

  
  //AD OPTION TO SET CUSTOM TIMER,save pref & keep it for next time ?
  return(

    
    <div>
      
      <div>
        <div className="flex flex-row  justify-items-center items-center gap-[10px]">
          <p className="ml-auto mr-auto text-lg">
            {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
          </p>
        </div>

        <div className="text-xs my-[10px] pl-[5px] flex flex-row justify-between  gap-[35px]">
          {!isCountDownActive ? (
            <span>
              Set{"   "}
              <input
                onChange={(e) => {
                  const regex = /^[0-9\b]+$/;
                  if (e.target.value === "" || regex.test(e.target.value)) {
                    setTimeLeft(e.target.value * 60);
                    setCountdownMinutes(e.target.value);
                  }
                }}
                className="w-[30px] px-[5px] py-[2px] ml-[5px] h-auto border-bottom border-1px text-center border-secondary focus:outline-none "
              />
              m
            </span>
          ) : null}
          <input
            className="w-[100px]   placeholder:text-xs h-auto border-bottom border-1px px-[5px] py-[2px] ml-[15px]  border-secondary focus:outline-none "
            placeholder="desc"
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-[10px] self-center  justify-center items-center my-[20px]">
          <button
            className="btn btn-xs btn-secondary"
            onClick={isCountDownActive ? pauseTimer : startTimer}
          >
            {!isCountDownActive ? "Play" : "Pause"}
          </button>

          <button className="btn btn-xs btn-secondary" onClick={resetTimer}>
            Reset
          </button>
          {isCountDownActive === false &&
          timeLeft !== countdownMinutes * 60 &&
          isRunning ? (
            !countDownSaved ? (
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
