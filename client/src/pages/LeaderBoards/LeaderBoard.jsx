import React, {useState, useEffect} from "react";
import AllSessions from "../AllSessions";
import Rankings from "./Rankings";
import {LeaderBoardContextProvider} from "../../context/LeaderBoardContext";
function LeaderBoard() {
  return (
    <div>
      <LeaderBoardContextProvider>
        <div className="w-[80%]  my-[10px] ml-[auto]  mr-[auto] z-[0] relative flex flex-col gap-[30px]">
          {/* <AllSessions /  > */}

          <Rankings />
        </div>
      </LeaderBoardContextProvider>
    </div>
  );
}

export default LeaderBoard;

// [{ room, score }]
//for every session, update array.
