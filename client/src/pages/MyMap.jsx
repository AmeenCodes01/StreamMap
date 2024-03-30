import React, { useState, useEffect, useCallback } from "react";
import TimeTable from "../components/TimeTable";
import Tracker from "../components/Tracker";
import Map from "../components/Map";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Timer from "../components/Timer";
import AllSessions from "./AllSessions";
import { useSocketContext } from "../context/SocketContext";
import { Link } from "react-router-dom";
import StreamVid from "../components/StreamVid";
import DisplayMessage from "../components/DisplayMessage";
import { IoExit } from "react-icons/io5";
import StreamTimer from "../components/StreamTimer";
import InSeshTimer from "../components/InSeshTimer";

const MyMap = () => {
  // myCountry saves user country

  const { id: room } = useParams();

  const { authUser } = useAuthContext();
  // write this into a useEffect.

  const [visible, setVisible] = useState(false);
  const toggleVisible = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);
  const { socket } = useSocketContext();
  // get all users by room. get room name from params.
  const [sleepTime, setSleepTime] = useState()
  useEffect(() => {
    if (socket !== null) {
      socket.emit("join-room", { room, userId: authUser._id });
    }
  }, [authUser, socket]);

  // useEffect(() => {
  //   setKey(key + 1);
  // }, [users]);

  // useEffect(() => {
  //   if (socket == null) return;
  //   // const handler = (e) => console.log(e);
  //   // socket.on("remove-device", e => console.log(e));

  //   socket.on("action", (data) => {
  //     console.log("Received action:", data);
  //   });
  //   return () => {
  //     socket.off("action", handler);
  //   };
  // }, [socket]);

  // const sendAction = () => {
  //   if (socket) {
  //     socket.emit("action", {
  //       userId: authUser._id,
  //       data: { message: "multiple tabs test" },
  //     });
  //   }
  // };

  const onLeaveRoom = () => {
    socket.emit("leave-room", { room, userId: authUser._id });
  };

  return (
    <div className="w-[100%]    flex flex-col  overflow-auto   relative   ">
      {/* MAP */}
      <div className="z-[1000000] w-[100%] flex flex-row">
        <Map />

        <div
          style={{
            display: visible ? "none" : "block",
          }}
          className="absolute  
    z-[1000000]   right-[10px] top-[50px] rotate-180 bg-base-100 p-[8px] rounded-[8px]  "
        >
          <Link to={"/"} onClick={onLeaveRoom} className=" ">
            <IoExit size={16} className="   " />
          </Link>
        </div>
        <button
          onClick={toggleVisible}
          className="btn  absolute  
    z-[1000000] btn btn-xs btn-primary  right-[10px] top-[10px] "
          style={{
            display: visible ? "none" : "block",
          }}
        >
          Times
        </button>

        {visible ? (
          <div className=" pl-[12px] w-[80%] sm:w-[16%] h-[100%]  sm:block h-[100%]    ">
            <TimeTable toggleVisible={toggleVisible} />
          </div>
        ) : null}
      </div>
<div className="pl-[10px]">

      {/* CHANGE MAP COUNTRIES & COLOR */}



      <div className="flex    gap-[10px] pt-[10px] self-end   ">
        <label
          className=" rounded-[6px] "
          style={{ backgroundColor: authUser.color, borderWidth: "0px" }}
        >
          <input
            type="color"
            value={authUser.color}
            className="w-[15px] h-[15px]  border-[0px] self-center  block opacity-0"
            style={{ backgroundColor: authUser.color, borderWidth: "0px" }}
            onChange={(e) => setColor(e.target.value)}
            />
        </label>
        <p className="mx-[5px] text-xs text-info"> {authUser.country}</p>
      </div>

      {/* STREAM PLAYER */}
      <div className="flex w-[100%] h-[100%]  ">
        <StreamVid />
      </div>
<DisplayMessage/>
      {/* {/* //Progress Tracker */}
      <div className="my-[20px]">
   <StreamTimer/>

      <InSeshTimer/>

      </div>
      <div className="flex  ">
        <Timer />
      </div>  
      
      <div className="w-[80%]  my-[10px] ml-[auto] w-[500px] mr-[auto] z-[0] relative flex flex-col gap-[30px]">
        <AllSessions />
      </div>

   

     
{/* {sleepTime} hr */}
 {/* <div className="rating mt-[20px]">
  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked />
  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
</div> */}
 
  </div>
    </div>
  );
};

export default MyMap;
