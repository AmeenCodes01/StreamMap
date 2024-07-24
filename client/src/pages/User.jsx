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
// import DiamondTimer, {DiamondTimerStyled} from "../components/DiamondTimer";
// import {HealthContextProvider} from "../context/HealthContext";
// import {LeaderBoardContextProvider} from "../context/LeaderBoardContext";
import useAuthId from "../hooks/useAuthId";
import {useNavigate, useParams} from "react-router-dom";
function User() {
  const navigate = useNavigate();
  const {id} = useParams();
  const [showSepWindow, setShowSepWindow] = useState(false);
  const {authId} = useAuthId();

  useEffect(() => {
    const handlePopState = () => {
      navigate(`/${id}/user`, {replace: true});
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, id]);
  if (authId == null) {
    return;
  }
  return (
    <div className=" sm:mt-[30px] mt-[10px] flex flex-col gap-[20px] bg-[url('/lonelyFire.gif')] bg-cover bg-center">
      {/* STREAM PLAYER */}

      <div className="flex  flex-col gap-[20px] ">
        <div className="flex flex-col sm:w-[50%] sm:h-[50%]   ">
          <StreamVid />
          <div className="flex ml-auto mr-auto">
            <DisplayMessage />
          </div>
        </div>

        <div className="flex  mb-[10px]  ">
          <Timer />

          <SepWindow />
        </div>
        <div className="flex sm:flex-row flex-col  space-between justify-between">
          <div className="flex mt-[10px] mb-[50px] flex-start align-top justify-start ">
            <Sessions />
          </div>
          <div className="flex self-center pr-[10px]">
            <InSeshTimer />
          </div>
        </div>
      </div>
      {/* 
      <div className="my-[20px] border-2 h-[40px] flex">
       <StreamTimer/> 
       <DiamondTimer secondsLeft={600} /> 
      </div> */}

      {/* <HealthContextProvider> */}
      {/* <LeaderBoardContextProvider>

        </LeaderBoardContextProvider> */}
      <div className="md:flex md:flex-row-reverse  w-[100%] md:justify-between mt-[50px]">
        {/* <div className="flex flex-row md:justify-end md:gap-[50px] w-[100%] min-h-[200px] justify-between pl-[25px] pr-[10px] my-[50px]">
            <MoodTracker />
            <SleepTracker />
          </div> */}
      </div>
      {/* </HealthContextProvider> */}
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
