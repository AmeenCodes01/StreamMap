
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useStore  from "../context/TimeStore";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import usePomodoro from "../hooks/usePomodoro";

const GoalInput = styled.input`
  transition: width 1s;
`;

const Dots = styled.div`
  animation: blink ${(props) => `${props.duration}s` || `${0}s`} infinite
    alternate;
  background-color: #6dc1e8;
  transform: rotate(45deg);
  border-width: 1.5px;
  @keyframes blink {
    50% {
      background-color: #fff;
    }
    100% {
      background-color: #6dc1e8;
      border-color: #fff;
      box-shadow: inset 5px 5px 10px 2px #89cff0, 0px 0px 15px 2px #89cff0;
    }

    0% {
      background-color: #e4f0f7;
      border-color: #6dc1e8;
      box-shadow: inset 0px 0px 10px 10px
          ${(props) => (props.duration === 2 ? `#1f75fe` : `#e4f0f7`)},
        0px 0px 5px 2px #${(props) => (props.duration === 2 ? `#000` : `#6dc1e8`)};
    }
  }
`;

function DiamondTimer({setIsOpen, isOpen}) {

  const { isPaused, setIsPaused, setIsRunning, workMinutes,time} = useStore(
    state =>({
      workMinutes: state.workMinutes  ,
      isPaused: state.isPaused,
      setIsPaused: state.setIsPaused  ,  
      setIsRunning: state.setIsRunning  ,
      time:state.secondsLeft
    })
  );

    let diamDiv;
    if (workMinutes <26 ){
    diamDiv =  5
    } else if ( workMinutes < 61){
       diamDiv = 10
    } else if (workMinutes < 91){
      diamDiv = 15
    }else {
      diamDiv = 20
    }
    
    const {start, pause} = usePomodoro()

  const diam = parseInt(workMinutes) % diamDiv !== 0 ? Math.floor(workMinutes / diamDiv) + 1
      : workMinutes / diamDiv;

  const diamDone = Math.floor((workMinutes*60 - time ) / 300)
  // console.log("diamDone",diamDone, diamDiv)
  const [nextFive, setFive] = useState(diamDone);
  //const [min, setMin] = useState(time || 60);
  // const [!isPaused, setStartSesh] = useState(true);
  const [duration, setDuration] = useState(300);
 // const [timeLeft, setTimeLeft] = useState(700);
  // const [diamonds, setDiamonds] = useState(diam);


  useEffect(() => {
    // let interval = null;
    // if (!isPaused && timeLeft > 0) {
    //   interval = setInterval(() => {
    //     setTimeLeft((prevTimeLeft) => {
    //       const newTimeLeft = prevTimeLeft - 1;
    //       if (newTimeLeft <= 0) {
    //         clearInterval(interval);
    //         return 0;
    //       }
    //       if (prevTimeLeft % 300 === 0 && prevTimeLeft < time) {
    //         console.log("changing nextFive", prevTimeLeft, prevTimeLeft % 300);
    //         setFive((prevFive) => prevFive + 1);
    //         setDuration(300);
    //       }
    //       return newTimeLeft;
    //     });
    //   }, 1000);
    // } else {
    //   clearInterval(interval);
    //   console.log("10 min completed");
    //   // setStartSesh(false);
    //   // nextFive > 0 ? setShowSeshRate(true) : null;
    //   setFive(0);
    // }
    // return () => {
    //   clearInterval(interval);
    // };
if ( time === workMinutes*60){
    setIsOpen(false)
      
}

// if(isOpen  === false){
//   console.log("close")
// setIsOpen(false)
// }


    if (time === 0){
      setIsOpen(false)
    }
    if (time %( diamDiv*60 )=== 0 && time < workMinutes*60) {
        console.log("changing nextFive", time, time % (diamDiv*60));
              setFive((prevFive) => prevFive + 1);
              setDuration(300);
          }
  }, [ isPaused, time]);

  // so start button will only appear if sesh starts so I dont need !isPaused.
  // but when pause and resume, I will need timer. If tab closed, I want timer to auto close.

  // console.log(timeLeft,"timeLeft")
  // console.log(nextFive,"nextFive")
  

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);



  return (
    <div
      style={{
        backgroundColor: "black",
        height: "100%",
        padding: "10px",
        display:"flex",
        paddingTop:"10px", 
        flex :"row",
        gap: "20px", 
        alignItems:"flex-start"
      }}
  
    >
      <div className="flex flex-col p-[10px] my-[20px]">
        {/* //add all that functionality for sockets, reduntant. make it sep components.  */}
        {isPaused ? (
          <div className="flex flex-row gap-[10px]">
            <button
              className=" items-center justify-center " style={{
                backgroundColor:"white", 
                borderWidth:"0px", 
                height:"30px", 
                width:"30px"
              }}
              onClick={start}
            >
              <FaPlayCircle size={15} /> 
            </button>
          </div>
        ) : ( 
          <button
          style={{
            backgroundColor:"white", 
            borderWidth:"0px", 
            height:"30px", 
            width:"30px"
          }}
            onClick={pause}
            className="btn btn-warning items-center justify-center"
          >
            <FaPauseCircle size={15} /> 
          </button>
        )}
      </div>
{/*  60<min<90, 10 min, 15 min */}
      <div style={{ display: "flex", flexDirection: "row", alignSelf:"flex-start", justifyContent:"flex-start", marginTop:"10px" }}>
        {Array(diam)
          .fill(true)
          .map((_, i) => {
            return (
              <div className="m-[12px] " key={i}>
                <div
                  className={`h-[25px] w-[25px] sm:h-[25px] sm:w-[25px]  
                     ${i === nextFive && !isPaused ? "blink" : ""}`}
                  style={{
                    backgroundColor:
                      (i === nextFive && !isPaused) ||
                      (i <= nextFive )
                        ? "#fff"
                        : "#6dc1e8", // Lighter shade if animated, darker shade otherwise
                    borderColor:
                      i === nextFive && !isPaused ? "#6dc1e8" : "#5442f5", // Darker shade if animated, lighter shade otherwise
                    boxShadow:
                      i === nextFive && !isPaused
                        ? "inset 5px 5px 5px 5px #e4f0f7, 0px 0px 3px 3px #6dc1e8" 
                        : "inset 2px 2px 2px 0px #89cff0, 0px 0px 2px 0px #89cff0", // Darker shadow if animated, lighter shadow otherwise
                    height: "10px",
                    width: "10px",
                    marginRight: "12px",
                    transform: " rotate(45deg)",
                  }}
                ></div>
              </div>
            );
            })}
      </div>
            <p className="text-white white" style={{ color:"white", textAlign:"center", marginBottom:"auto", border:"12px", 
              borderColor:"red", 
              alignSelf:"center"}}>

              {`${minutes < 10 ? "0" : ""}${minutes}:${
            seconds < 10 ? "0" : ""
          }${seconds}`}
            </p>
    </div>
  );
}

export const DiamondTimerStyled = styled(DiamondTimer)``;

export default DiamondTimer;

// time passed will be Work Minutes. But if paused or something, will diamonds act accordingly ? What if it is closed mid session and re opened.
// A normal timer (use RankingTimer) and a hook that watches for the next 5 using time of the timer.

// so
