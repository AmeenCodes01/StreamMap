import React, { useState, useEffect,useRef } from "react";
import { useLeaderBoardContext } from "../../context/LeaderBoardContext";
import { useSocketContext } from "../../context/SocketContext";
import { Table, Button,  } from 'react-daisyui';
import { TablePagination } from 'react-pagination-table';
import useGetUsers from "../../hooks/useGetUsers";
import RankingTimer from "./RankingTimer";
function Rankings() {
  const { rankings, setRankings, liveRanking } = useLeaderBoardContext();
  

  
  
  
  const SessionTableRow = ({ session }) => {
    const {users, loading} = useGetUsers()
    const { userId, goal, duration, totalDuration, totalScore, rating, _id, createdAt } =
      session;

      if(loading){
        return; 
      }

    return (
      <tr className=" h-[50px]">
 {/* <td>
 {users.filter((u)=>  u._id===e.userId)[0].name ?users.filter((u)=>  u._id===e.userId)[0].name :null }</td>      */}
    <td>{goal}</td>
        <td className="items-center ">
          <RankingTimer
            duration={duration*60}
            onFinish={() => console.log("Timer finished")}
            id={session._id}
            createdAt={createdAt}
          />
        </td>    
        <td>{totalDuration}</td>
        <td>{totalScore}</td>
        <td>3</td>
        <td>{ rating ?  rating: null}</td>
      </tr>   
    );
  };

  // export default Timer;

 
  // if (loading) {
  //   return <span className="loading loading-infinity loading-md"></span>;
  // }
  return (
    <div className="flex border-2 w-[80%] items-center self-center mt-[20px]">
          <Table className="table table-zebra table-xs  rounded-[12px] table-pin-rows  items-center">
          <thead>
          <tr>
            <th>User ID</th>
            <th>Goal</th>
            <th>Countdown</th>
            <th>Total Duration</th>
            <th>Total Score</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody> 
          {liveRanking.map((session) => (
            <SessionTableRow key={session._id} session={session} />
          ))}
        </tbody>
    </Table>
    
      {/* <table>
       
        <tbody> 
          {liveRanking.map((session) => (
            <SessionTableRow key={session._id} session={session} />
          ))}
        </tbody>
      </table> */}
    </div>
  );
}

export default Rankings;

//duration



//find user name from id 
//display nothing or duration when timer ends 
//daisy UI table 
//pagination
//goal below countdown 
//score not updating, why so ?
