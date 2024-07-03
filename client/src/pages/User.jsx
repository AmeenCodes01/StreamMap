import React, {useState, useEffect} from "react";
import StreamVid from "../components/StreamVid";
import DisplayMessage from "../components/DisplayMessage";
import InSeshTimer from "../components/InSeshTimer";
import Timer from "../components/Timer";
import SleepTracker from "../components/SleepTimer";
import MoodTracker from "../components/MoodTracker";
import Sessions from "../components/Sessions";
import myImage from "../assets/Flamingo.png";
import SepWindow from "../components/SepWindow";
import DiamondTimer, {DiamondTimerStyled} from "../components/DiamondTimer";
import {HealthContextProvider} from "../context/HealthContext";
import {LeaderBoardContextProvider} from "../context/LeaderBoardContext";
import UserSessions from "../components/UserSessions";
import {MdOutlineArrowOutward} from "react-icons/md";
import useAuthId from "../hooks/useAuthId";
function User() {
  const [showSepWindow, setShowSepWindow] = useState(false);
 const {authId} = useAuthId()

  if (authId == null){
return;
  }
  return (
    <div className=" sm:mt-[30px] mt-[10px]">
      {/* STREAM PLAYER */}

        <div className="flex sm:flex-row flex-col ">
          <div className="flex flex-col sm:w-[50%] sm:h-[50%]   ">
            <StreamVid />
            <div className="flex ml-auto mr-auto">
              <DisplayMessage />
            </div>
          </div>

          <div className="flex sm:mt-[30px] mt-[25px] ">
            <Timer />

            <SepWindow />
          </div>
        </div>

        <div className="my-[20px] border-2 h-[40px] flex">
          {/* <StreamTimer/> */}
          {/* <DiamondTimer secondsLeft={600} /> */}
        </div>

        {/* <HealthContextProvider>
          <LeaderBoardContextProvider>
            <Sessions />
          </LeaderBoardContextProvider>
          <div className="md:flex md:flex-row-reverse  w-[100%] md:justify-between">
            <div className="flex flex-row md:justify-end md:gap-[50px] w-[100%] min-h-[200px] justify-between pl-[25px] pr-[10px] my-[50px]">
              <MoodTracker />
              <SleepTracker />
            </div>
            <UserSessions />
          </div>
        </HealthContextProvider> */}
        <InSeshTimer />
      <div className=" h-[200px] flex w-[60px] overflow-hidden relative ">
        <div
          className="bg-base-200 w-full h-[00%] bottom-0 absolute"
          style={{}}
        ></div>
        {/* <DiamondTimerStyled /> */}
        <img src={myImage} alt="" className="flex h-[100%] " />
      </div>
    </div>
  );
}

export default User;
