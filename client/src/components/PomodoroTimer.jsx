import React, { useState, useEffect } from "react";
import myImage from "../assets/Flamingo.png";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

const PomodoroTimer = ({ initialWorkMinutes = 5, initialBreakMinutes = 5 }) => {
  const [minutes, setMinutes] = useState(initialWorkMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              clearInterval(interval);
              setIsActive(false);
              if (isBreak) {
                setMinutes(initialWorkMinutes);
                setIsActive(true);
              } else {
                setMinutes(initialBreakMinutes);
                setIsActive(true);
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
        setMinutes((prevMinutes) => {
          if (prevMinutes === 0 && seconds === 0) {
            return prevMinutes;
          } else if (seconds === 0) {
            return prevMinutes - 1;
          } else {
            return prevMinutes;
          }
        });
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    seconds,
    minutes,
    initialWorkMinutes,
    initialBreakMinutes,
    isBreak,
  ]);

  const openNewWindow = () => {
    const url = "/PomodoroTimer.jsx";
    const newWindow = window.open(
      "",
      "_blank",
      "width=400,height=400,alwaysRaised=yes"
    );
    if (newWindow) {
      newWindow.focus();
    } else {
      console.error("Pop-up blocked. Please allow pop-ups for this site.");
    }
  };

  useEffect(() => {
    localStorage.setItem("pomodoroMinLeft", minutes);
    localStorage.setItem("pomodoroSecLeft", seconds);
    localStorage.setItem("pomodoroActive", isActive);
    localStorage.setItem("pomodoroBreak", isBreak);
  }, [isActive, seconds, minutes, isBreak]);

  // Add this useEffect to update `minutes` based on localStorage changes
  useEffect(() => {
    const localStorageMinutes = parseInt(
      localStorage.getItem("pomodoroMinLeft")
    );
    setMinutes(
      Number.isNaN(localStorageMinutes)
        ? initialWorkMinutes
        : localStorageMinutes
    );
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

  const progress = isBreak
    ? ((initialBreakMinutes * 60 - (minutes * 60 + seconds)) /
        (initialBreakMinutes * 60)) *
      100
    : ((initialWorkMinutes * 60 - (minutes * 60 + seconds)) /
        (initialWorkMinutes * 60)) *
      100;

  return (
    <div className="flex " style={{}}>
      {/* <div className="self-center flex-row  mr-auto flex gap-[10px] ">
        <button className=" btn btn-sm bg-accent" onClick={toggleTimer}>
          {isActive ? "Pause" : "Start"}
        </button>
        <button className=" btn btn-sm bg-neutral" onClick={resetTimer}>
          Reset
        </button>
        <div>
      <button onClick={openNewWindow}>Open Component in New Window</button>
    </div>
      </div> */}
      {/* <div className="flex flex-col">
        <div style={{ position: 'relative',  borderRadius: '4px' }} className="border-4 bg-base border-secondary min-w-[200px] min-h-[40px] flex ">
          <div className={ isBreak ? "bg-error":  "bg-success"}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${progress}%`,
              height: '100%',
              transition: 'width 0.5s ease-in-out' 
              
            }}
          />
          <img src={myImage} alt="" className='flex  absolute   ' />
          <div style={{ position: 'absolute', zIndex: 1000, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} className=" text-xs  justify-center  gap-[10px] flex flex-row w-[100%] ">

            <p className="">

            {`${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
            </p>
            <p>Finish Chapter 6 </p>
          </div>
        </div>
        <h2 className="text-center self-end badge-xs py-[10px] my-[10px]  ml-auto badge badge-warning  ">
          {isBreak ? "Break" : "Work"}
        </h2>
      </div> */}
      {/* <div className=" h-[200px] flex w-[60px] overflow-hidden relative bg-white "
      style={{
        background: "linear-gradient(90deg, rgba(37,11,24,1) 0%, rgba(40,38,41,1) 100%)"
      }}
      >
  <div className='bg-base-200 w-full  bottom-0 absolute opacity-[0.93] rounded-[8px] 	 ' style={{
                  height: `${100 - progress}%`,
                  background: "linear-gradient(90deg, rgba(202,117,114,1) 0%, rgba(227,229,216,1) 100%)"


  }}>
 
  </div>
  <div style={{ position: 'absolute', zIndex: 1000, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} className=" text-xs  justify-center  gap-[10px] flex flex-col w-[100%] ">

<p className="badge px-[5px] self-center ">

{`${minutes
  .toString()
  .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
</p>
<p className="badge text-xs self-end opacity-75 rotate-90  ">Finish Chapter 6 </p>
</div>
  <img src={myImage} alt="" className='flex h-[100%] ' />
    </div> */}
      <div
        style={{
          height: "100%",
          display: "flex",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          background: "#162839",
        }}
      >
        <div
          className="bg-base-200"
          style={{
            height: "100%",
            bottom: "0",
            position: "absolute",
            opacity: "0.96",
            width: `${progress}%`,
            background: "#ff9a00",
            zIndex: "10000",
          }}
        />
        <div
          style={{
            position: "absolute",
            zIndex: "10000",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <button
            className=" btn btn-sm "
            onClick={toggleTimer}
            style={{
              color: "white",
              backgroundColor: "black",
              borderRadius: "10px",
              padding: "5px",
              marginLeft: "5px",
            }}
          >
            {isActive ? <FaPause /> : <FaPlay />}
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <p
              className="badge px-[5px] self-center"
              style={{
                backgroundColor: "black",
                color: "white",
                paddingLeft: "8px",
                paddingRight: "8px",
                borderRadius: "10px",
                paddingTop: "5px",
                paddingBottom: "5px",
                fontSize: "12px",
                marginBottom: "12px",
              }}
            >
                      {`${minutes
  .toString()
  .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}            </p>

            <p
              className="badge text-xs self-end opacity-75 "
              style={{
                backgroundColor: "black",
                color: "white",
                paddingLeft: "8px",
                paddingRight: "8px",
                marginTop: "30px",
                borderRadius: "10px",
                fontSize: "12px",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
            >
              Finish Chapter 6
            </p>
          </div>
        </div>
        <img
          src={myImage}
          alt=""
          style={{
            height: "150%",
            alignSelf: "center",
            marginLeft: "auto",
            marginRight: "auto",
            transform: "rotate(270deg)",
            zIndex: "10000000",
          }}
        />
      </div>
    </div>
  );
};

export default PomodoroTimer;
