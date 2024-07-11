import React, {useState, useEffect, useRef} from "react";
import {useLeaderBoardContext} from "../../context/LeaderBoardContext";
import {Table, Pagination} from "react-daisyui";
import useGetUsers from "../../hooks/useGetUsers";
import RankingTimer from "./RankingTimer";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

function Rankings() {
  const {liveRanking} = useLeaderBoardContext();
  const itemsPerPage = 1; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  // Slice the data array based on the current page
  const currentPageData = liveRanking.slice(startIndex, endIndex);

  const SessionTableRow = ({session}) => {
    const {users} = useGetUsers();
    const {
      userId,
      goal,
      duration,
      totalDuration,
      totalScore,
      rating,
      name,
      createdAt,
    } = session;

    const idToNameMap = (userId) => {
      let foundName = null; // Initialize with a default value

      for (const country in users) {
        users[country].forEach((users) => {
          users.forEach((user) => {
            if (userId === user._id) {
              foundName = user.name; // Store the found name
            }
          });
        });
      }

      return foundName; // Return the name (or null if not found)
    };

    //find id from name & display

    return (
      <tr className=" ">
        <td>{name}</td>
        <td>{goal}</td>
        <td className="">
          <RankingTimer
            duration={duration}
            onFinish={() => console.log("Timer finished")}
            id={session._id}
            createdAt={createdAt}
          />
        </td>
        <td>{totalDuration}</td>
        <td>{totalScore}</td>
        <td>{rating ? rating : null}</td>
      </tr>
    );
  };

  // export default Timer;

  // if (loading) {
  //   return <span className="loading loading-infinity loading-md"></span>;
  // }
  //if user go offline, then name disappears. so need to store.
  return (
    <div className="   ">
      <table className="table table-xs table-pin-rows table-pin-cols">
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
          {currentPageData.map((session) => (
            <>
              <SessionTableRow key={session._id} session={session} />
            </>
          ))}
        </tbody>
      </table>

      {/* <table>
       
        <tbody> 
          {liveRanking.map((session) => (
            <SessionTableRow key={session._id} session={session} />
          ))}
        </tbody>
      </table> */}
      <div className="flex flex-end flex-row ">
        <button
          className=" bg-white size-[20px]"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <IoIosArrowBack size={15} />
        </button>
        <button
          className="size-[20px] bg-white"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <IoIosArrowForward size={15} />
        </button>
      </div>
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
