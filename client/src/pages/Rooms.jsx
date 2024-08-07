import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {CiShop} from "react-icons/ci";
import {RiLogoutCircleLine} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import RoomCard from "../components/Room/RoomCard";
import DonationInfo from "../components/Auth/DonationInfo";
// sm:justify-items-center
// sm:items-center sm:justify-center
const rooms = ["Shamsia", "Test"];

function Rooms() {
  const navigate = useNavigate();

  return (
    <div
      className="  p-[20px]  h-[100vh] 
      flex flex-col 
    "
    >
      <div className="w-[100%]  items-end justify-end flex gap-[30px] ">
        <Link to="/shop">
          <CiShop
            color="white"
            size={35}
            className="border-dashed border-1 rounded-lg p-[5px]"
          />
        </Link>
        <RiLogoutCircleLine
          color="white"
          className="cursor-pointer"
          size={30}
          onClick={() => {
            localStorage.clear();
            window.history.replaceState(null, "", "/login");
            window.location.reload();
          }}
        />
      </div>

      {/* Input Country + color + username */}
      {/* <div className=" h-[100vh] border-2"></div> */}
      {/* <input onClick={(event) => setUsername(event.target.value)} /> */}

      <div className="sm:flex-row  flex flex-col gap-[20px] sm:gap-[10px] self-center items-center justify-center justify-self-center mt-[auto] mb-[auto] ">
        {rooms.map((admin) => (
          <RoomCard name={admin} />
        ))}
      </div>
      {/* <button
          onClick={() => {
            socket.emit("user-join", {username});
          }}>
          {" "}
          Join StreamMap
        </button> */}
      <DonationInfo />
    </div>
  );
}

//get YT username first. then get list of all users from MongoDB.
// If already there, send data to the room they click. If none, create new and join room.

export default Rooms;
