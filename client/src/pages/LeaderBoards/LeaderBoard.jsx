import React, {useState, useEffect} from "react";
import AllSessions from "../AllSessions";
import Rankings from "./Rankings";
import {LeaderBoardContextProvider} from "../../context/LeaderBoardContext";
function LeaderBoard() {
  return (
    <div className="sm:mt-[30px] mt-[10px] bg-base-100 ">
      <LeaderBoardContextProvider>
        <div className="w-[80%] my-[10px] mx-auto z-0 relative flex flex-col gap-[30px] h-full">
          <Rankings />
        </div>
      </LeaderBoardContextProvider>
    </div>
  );
}

export default LeaderBoard;

// [{ room, score }]
//for every session, update array.
