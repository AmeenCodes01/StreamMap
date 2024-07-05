import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {CiShop} from "react-icons/ci";
import usePromise from "../hooks/usePromise";
// sm:justify-items-center
// sm:items-center sm:justify-center

function Rooms() {
  const [totalDon, setTotalDon] = useState();
  const {getTotalDonations} = usePromise()
  useEffect(() => {
    const getTotalDonate = async () => {
      const data = await getTotalDonations();
      if (data) {

        
        setTotalDon(data);
       }
    };

   
getTotalDonate()  }, []);
  return (
    <div
      className="bg-gray-500 h-[100vh] p-[20px] 
      flex flex-col
    "
    >
      <div className="w-[100%] border-2 items-end justify-end flex  ">
        <Link to="/shop">
          <CiShop color="white" size={30} className="" />
        </Link>
      </div>

      {/* Input Country + color + username */}
      {/* <div className=" h-[100vh] border-2"></div> */}
      {/* <input onClick={(event) => setUsername(event.target.value)} /> */}
      <div>
        {/* <button
          onClick={() => {
            socket.emit("user-join", {username});
          }}>
          {" "}
          Join StreamMap
        </button> */}
      </div>
      <div className="sm: sm: flex flex-row gap-[6px] sm:gap-[10px] ">
        <Link to="/Shamsia">
          <div
            onClick={() => {
              // socket.emit("join", {room: "Shamsia", username: "Ameen"});
            }}
            className="bg-black sm:h-[200px] sm:w-[200px] w-[50%] h-[50%] 
       rounded-[13px] p-[8px] items-center justify-center justify-items-center flex flex-col gap-[12px] "
          >
            <div className="bg-white w-[70px] h-[70px] rounded-[100%] self-center "></div>
            <p className="text-white text-center">SD's World</p>
          </div>
        </Link>
        {/* //Khatira */}
        <Link to="/Khatira">
          <div
            onClick={() => {
              // socket.emit("join", {room: "3243", username});
            }}
            className="bg-black sm:h-[200px] sm:w-[200px] w-[50%] h-[50%] 
       rounded-[13px] p-[8px] items-center justify-center justify-items-center flex flex-col gap-[12px] "
          >
            <div className="bg-white w-[70px] h-[70px] rounded-[100%] self-center "></div>
            <p className="text-white text-center">KT's World</p>
          </div>
        </Link>
      </div>
      <span className="text-bold">{Math.floor(parseInt(totalDon)/2)}$ donated</span>
    </div>
  );
}
//get YT username first. then get list of all users from MongoDB. If already there, send data to the room they click. If none, create new and join room.

export default Rooms;
