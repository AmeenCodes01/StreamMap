import React, {useState, useEffect} from "react";
import UserSessions from "../components/UserSessions";
function AllUsers() {
  //these things should be in authUser because this s

  return (
    <div className="  h-[100%] flex flex-col pt-[100px] ">
      <UserSessions />
    </div>
  );
}

export default AllUsers;
