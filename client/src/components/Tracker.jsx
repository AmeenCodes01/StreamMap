import React, {useState, useEffect} from "react";
import {styles} from "../styles";
import {Dots} from "./TrackerEl";
import {io} from "socket.io-client";
import {useParams} from "react-router-dom";

// currentSesh, completedSesh, no of minutes in current Sesh



function Tracker({socket}) {
  const [nextFive, setFive] = useState(0);
  const [streamNextFive, setStreamFive] = useState(1);
  const [seshStart, setStartSesh] = useState(false);
  const [streamSeshStart, setStreamSeshStart] = useState(false);
  const [seshGoal, setSeshGoal] = useState();
  const [min, setMin] = useState(60);
  const [goalDisabled, setGoalDisabled] = useState(true);
  const [showSeshRate, setShowSeshRate] = useState(false);
  const [seshRating, setSeshRating] = useState(100);
  const [seshCount, setSeshCount] = useState(0);
  const [seshInfo, setSeshInfo] = useState([]);
  const [allSeshInfo, setAllSeshInfo] = useState([]);
  // date, sesh# , seshgoal + how much done in %
  //get socket from context instead of initialising everywhere
  const {id: room} = useParams();
  useEffect(() => {
    let interval = null;

    if (seshStart === true && nextFive < min / 5) {
      interval = setInterval(() => {
        setFive(nextFive + 1);
        // setStartSesh(false);
      }, 1000 * 5);
    } else {
      clearInterval(interval);
      setStartSesh(false);
      nextFive > 0 ? setShowSeshRate(true) : null;
      setFive(0);
    }
    return () => {
      clearInterval(interval);
    };
  }, [nextFive, seshStart]);

  useEffect(() => {
    let interval = null;
    //if user === Shams &&
    if (streamSeshStart === true && streamNextFive < 12) {
      interval = setInterval(() => {
        setStreamFive(streamNextFive + 1);
        // socket.emit("nextStreamFive", streamNextFive);

        //update on all room users timer
        //socket.emit("nextStreamFive", streamNextFive)
      }, 1000 * 3);
    } else {
      // console.log("StreamSeshEnd");
      // console.log(nextFive);

      clearInterval(interval);
      setStreamSeshStart(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [streamNextFive, streamSeshStart]);

  useEffect(() => {
    if (socket == null) return;
    socket.on("nextStreamFive", (i) => {
      console.log(i);
      setStreamFive(i);
    });
  }, [socket]);

  return (
    <div
      className="border-[1px]  rounded-tl-[30px] shadow-2xl ml-[10px]
       
        pl-[15px]  pt-[5px] pr-[8px]
      "
      style={{}}>
      <div className="">
        <p className={` ${styles.tw} `}>Session {seshCount}/5</p>
      </div>
      {/*
      
      STREAM PROGRESS
      
      */}
      <div className="flex flex-row  w-[100%] ">
        <div>
          <div className="  ">
            <p className="">Stream progress </p>
            {/* <div className="flex flex-row border-[1px]  sm:flex-nowrap flex-wrap ">
              {Array(min / 5)
                .fill(true)
                .map((_, i) => {
                  return (
                    <div className="m-[10px]" key={i}>
                      <Dots
                        className=" h-[15px] w-[15px] sm:h-[19px] sm:w-[19px]"
                        duration={
                          i === streamNextFive && streamSeshStart ? 0.1 : 0
                        }></Dots>
                    </div>
                  );
                })}
            </div> */}
            My Progress
            <div className="grid-col-3  flex  flex-wrap  ">
              {Array(12)
                .fill(true)
                .map((_, i) => {
                  return (
                    <div className="m-[10px]" key={i}>
                      <Dots
                        className=" h-[15px] w-[15px] sm:h-[19px] sm:w-[19px]"
                        duration={i === nextFive && seshStart ? 3 : 0}></Dots>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
         <button
  style={{
    opacity: seshStart ? "0.5" : "1",
  }}
  onClick={() => {
    if (goalDisabled) {
      setGoalDisabled(false);
    } else {
      setStartSesh(true);
      setFive(0);
      seshStart ? setGoalDisabled(true) : null;
    }
  }}
  className=" text-[15px] flex focus:outline-none 
  self-start justify-start justify-self-start  ml-[auto] min-h-[30px] sm:px-[10px] ">
  {goalDisabled ? "start" : "GO"}
</button>
        <div className=" justify-items-end align-bottom mt-auto">
          <button
            onClick={() => {
              // setStartSesh(true);
              // setFive(0);
              setStreamSeshStart(true);
              setStreamFive(0);
            }}
            className="bg-white align-bottom text-[15px] sm:hidden ">
            Start Session
          </button>
        </div>
        {/* <div className="hidden sm:flex w-[100%]  justify-end ">
          <div className="flex flex-row w-[100%]">
            <div className="border-[1px]  border-black w-[100%]">#Session</div>
            <div className="border-[1px] px-[10px] border-black w-[100%]">
              goal
            </div>
            <div className="border-[1px] px-[10px] border-black w-[100%]">
              done
            </div>
            {/* A list of sessions of the current day, their goals and if done or not. All will be visible to Shams.   
          </div>
        </div> */}
      </div>
      {/* 
MY PROGRESS
*/}


    </div>
  );
}

export default Tracker;

//socket io informs new user. informs session start/end, and every 5 min too so that they remain aligned. also when goal added.

//MOBILE
//Input goal in row with button, enter goal + click tick --> session starts. In the end, show done button, or __% done. default 100. after done, pressed, show all this info in the table.


//all sessions diamond show, user joined diamond glow and then further ahead. then bg of it plays another timer ??



// <div className="flex flex-row  w-[100%]  mt-[10px] border-2 ">
// {/* {!goalDisabled ? ( */}
// <input
//   value={seshGoal}
//   style={{
//     height: !goalDisabled ? "30px" : "0px",
//     width: "200px",
//     transition: "height 1s",
//     paddingLeft: !goalDisabled ? "5px" : "0px",
//   }}
//   placeholder="your goal for this session"
//   className="    text-start h-[50px] text-[15px]  focus:outline-none mr-[3px]"
//   onChange={(e) => setSeshGoal(e.target.value)}
// />
// {/* ) : null} */}
// {/* SESSION TRACKER IN % */}

// <button
//   style={{
//     opacity: seshStart ? "0.5" : "1",
//   }}
//   onClick={() => {
//     if (goalDisabled) {
//       setGoalDisabled(false);
//     } else {
//       setStartSesh(true);
//       setFive(0);
//       seshStart ? setGoalDisabled(true) : null;
//     }
//   }}
//   className=" text-[15px] flex focus:outline-none 
//   self-start justify-start justify-self-start  ml-[auto] min-h-[30px] sm:px-[10px] ">
//   {goalDisabled ? "start" : "GO"}
// </button>
// </div>
// {showSeshRate ? (
// <div className="flex flex-row mt-[10px]">
//   <p className="text-center self-center mr-[5px] text-[14px]">
//     rate your session :
//   </p>
//   <input
//     type="text"
//     value={seshRating}
//     maxLength={3}
//     className="pl-[5px] w-[36px]  h-[30px] focus:outline-none"
//     onChange={(e) => {
//       const regex = /^[0-9\b]+$/;
//       if (e.target.value === "" || regex.test(e.target.value)) {
//         setSeshRating(e.target.value);
//       }
//     }}
//   />
//   <p className="text-center flex self-center pl-[5px] "> %</p>

//   <TiTick
//     size={30}
//     color="white"
//     className=" self-center ml-[5px] h-[30px]"
//     onClick={() => {
//       const sessionCompleted = [
//         {
//           sessNumber: seshCount,
//           rating: seshRating,
//           goal: seshGoal,
//         },
//       ];
//       setSeshInfo([...seshInfo, sessionCompleted]);
//       setShowSeshRate(false);
//       setGoalDisabled(true);
//       setSeshCount(seshCount + 1);
//       socket.emit("send-StartGoal", {
//         text: seshGoal,
//         name: socket.id,
//         id: `${socket.id}`,
//         // socketID: socket.id,
//       });
//     }}
//   />
// </div>
// ) : null}
// {/* 
// ALL SESSIONS HISTORY TABLE
// */}
// <div className="w-[100%] my-[10px] ">
// {/* <SessionTable arr={seshInfo} /> */}
// </div>

// {/* <div className="w-[100%] my-[10px] mt-[15px] ">
// <SessionTable arr={seshInfo} table={"all"} />
// </div> */}