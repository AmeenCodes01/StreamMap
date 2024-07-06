import React, {useState, useEffect} from "react";
import {FaPlus} from "react-icons/fa";
import useGetUsers from "../hooks/useGetUsers";
import {useAuthContext} from "../context/AuthContext";
function AllUsers() {
  const {users} = useGetUsers();
  const {authUser} = useAuthContext();
  //these things should be in authUser because this s
  const [score, setScore] = useState();



  useEffect(() => {
    //we getting the score of authUser from here.
    const User = Object.keys(users).filter((country) => {
      let u;
      users[country].filter((timeZone) => {
        timeZone.filter((user) => {
          if (user._id === authUser._id) {
            u = user;
          }
        });
      });
      return u;
    });
  }, []);
  return (
    <div className=" w-[100px] h-[100%] flex flex-col ">
      {/* get score */}
      {/* <div>score</div>
      <div>
        <div className=" flex flex-row justify-between w-[100%] ">
          <h2>Promises</h2>
          <FaPlus />
        </div>
      </div>
      <div>
        <div className="border-2 h-[50px] items-center text-center ">
          Palestine
        </div>
        <div className="border-2 w-[100%]  ">
          coins submitted for this promise
        </div>
      </div> */}
    </div>
  );
}

export default AllUsers;
