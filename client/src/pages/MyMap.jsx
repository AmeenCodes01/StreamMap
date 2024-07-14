import React, {useState, useEffect, useCallback} from "react";
import TimeTable from "../components/TimeTable";
import Tracker from "../components/Tracker";
import Map from "../components/Map";
import {useParams} from "react-router-dom";
import {useAuthContext} from "../context/AuthContext";
import {useSocketContext} from "../context/SocketContext";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {useLiveStream} from "../hooks/useLiveStream";
import {IoExit} from "react-icons/io5";
import User from "./User";

const MyMap = () => {
  // myCountry saves user country
  const navigate = useNavigate();

  const {id: room} = useParams();

  const {authUser} = useAuthContext();
  console.log("render");

  // write this into a useEffect.
  const [visible, setVisible] = useState(false);
  const toggleVisible = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);
  const {socket, isConnected} = useSocketContext();
  // get all users by room. get room name from   params.
  const [tab, setTab] = useState("Timer");

  const joinRoom = useCallback(() => {
    if (isConnected && authUser && room) {
      console.log("Emitting join-room event", room, authUser._id);
      socket.emit("join-room", {room, userId: authUser._id});
    }
  }, [socket, isConnected, authUser, room]);

  useEffect(() => {
    joinRoom();
  }, [joinRoom]);

  const onLeaveRoom = () => {
    socket.emit("leave-room", {room, userId: authUser._id});
  };

  return (
    <div className="w-[100%] mr-[20px]   flex flex-col  overflow-hidden   relative  px-[10px] ">
      {/* MAP */}
      <div className=" w-[100%] flex flex-row">
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
          className=" absolute  
    z-[1000000] btn btn-xs btn-primary  right-[10px] top-[10px] "
          style={{
            display: visible ? "none" : "block",
          }}
        >
          Times
        </button>

        {visible ? (
          <div className=" pl-[12px] w-[80%] sm:w-[16%]        h-[100%]  sm:block    ">
            <TimeTable toggleVisible={toggleVisible} />
          </div>
        ) : null}
      </div>

      <div className="collapse ">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          Click me to show/hide content
        </div>
        <div className="collapse-content">
          <p>hello</p>
        </div>
      </div>
      {/* <Tracker/> */}

      <div className="mt-[10px] ">
        <div role="tablist" className="tabs tabs-boxed tabs-xs">
          <Link
            role="tab"
            to=""
            className={`tab ${tab == "Timer" ? "tab-active" : null} `}
            onClick={() => setTab("Timer")}
          >
            Timer
          </Link>
          <Link
            role="tab"
            to="leaderboard"
            className={`tab ${tab == "Leaderboard" ? "tab-active" : null} `}
            onClick={() => setTab("Leaderboard")}
          >
            Leaderboard
          </Link>
          <Link
            role="tab"
            to="sessions"
            className={`tab ${tab == "Study Buddies" ? "tab-active" : null} `}
            onClick={() => setTab("Study Buddies")}
          >
            Sessions
          </Link>
        </div>

        <Outlet />
        {/* <User /> */}

        {/* CHANGE MAP COUNTRIES & COLOR */}
        {/* 
<div className="flex flex-row self-center w-[100%] items-center justify-center">
<h1 className=""> JESS, WE GOT YOU      </h1>
<iframe className="self-center mr-[auto] ml-[auto]" src="https://giphy.com/embed/l41Yh1olOKd1Tgbw4" width="300" height="300" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/studiosoriginals-domitille-collardey-l41Yh1olOKd1Tgbw4">via GIPHY</a></p>
</div>
<div className="flex flex-row self-center w-[100%] items-center justify-center">
<iframe src="https://giphy.com/embed/5kIh9jg6olLrZJtAf6" width="480" height="384" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/thewoobles-cute-kawaii-woobles-5kIh9jg6olLrZJtAf6">via GIPHY</a></p>

<iframe width="700" height="700" src="https://www.youtube.com/embed/tYzMYcUty6s?si=jRBtZEORnHTEr-fC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<iframe src="https://giphy.com/embed/F0DXqcT2ZeaGXUnPmG" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/abcnetwork-a-million-little-things-amlt-millionaires-F0DXqcT2ZeaGXUnPmG">via GIPHY</a></p>
</div>
 */}

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

export default React.memo(MyMap);

// <div className="flex    gap-[10px] pt-[10px] self-end   ">
//         <label
//           className=" rounded-[6px] "
//           style={{backgroundColor: authUser.color, borderWidth: "0px"}}
//         >
//           <input
//             type="color"
//             value={authUser.color}
//             className="w-[15px] h-[15px]  border-[0px] self-center  block opacity-0"
//             style={{backgroundColor: authUser.color, borderWidth: "0px"}}
//             onChange={(e) => setColor(e.target.value)}
//           />
//         </label>
//         {/* <p className="mx-[5px] text-xs text-info"> {authUser.country}</p> */}
//       </div>
