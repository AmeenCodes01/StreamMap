import React from "react";
import {Link} from "react-router-dom";

function RoomCard({name}) {
  console.log(name, "name");
  return (
    <Link to={`/${name}`} key={name}>
      <div
        onClick={() => {
          // socket.emit("join", {room: "Shamsia", username: "Ameen"});
        }}
        className="bg-primary h-[200px] w-[200px]  
       rounded-[13px] p-[8px] items-center justify-center justify-items-center flex flex-col gap-[12px] "
      >
        <div className="bg-white w-[70px] h-[70px] rounded-[100%] self-center "></div>
        <p className="text-white text-center">{name} Room</p>
      </div>
    </Link>
  );
}

export default RoomCard;
