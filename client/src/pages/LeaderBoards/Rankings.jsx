import React, {useState, useEffect, useRef} from "react";
import {useLeaderBoardContext} from "../../context/LeaderBoardContext";
import {Table, Pagination} from "react-daisyui";
import useGetUsers from "../../hooks/useGetUsers";
import RankingTimer from "./RankingTimer";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

function Rankings() {
  const {liveRanking} = useLeaderBoardContext();
  const itemsPerPage = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  // Slice the data array based on the current page
  const currentPageData = liveRanking?.slice(startIndex, endIndex);

  const SessionTableRow = ({session}) => {
    //const {users} = useGetUsers();
    const {
      userId,
      goal,
      duration,
      totalDuration,
      totalScore,
      ratings,
      name,
      createdAt,
    } = session;

    const convertArrtoString = (arr) => {
      let ratingString = "";
      arr.map((r, i) => {
        ratingString = ratingString.concat(r.toString());
        i !== arr.length - 1 ? (ratingString = ratingString.concat(" ")) : null;
      });
      return ratingString;
    };

    //find id from name & display
    if (liveRanking === undefined) {
      return;
    }

    return (
      <tr className=" ">
        <td>{name}</td>
        <td>{goal}</td>
        <td className="">
          <RankingTimer
            duration={duration}
            onFinish={() => console.log("Timer finished")}
            id={session._id}
            isPaused={session.isPaused}
            status={session.status}
            ratings={ratings}
            key={session._id}
            //  createdAt={createdAt}
          />
        </td>
        <td>{totalDuration}</td>
        <td>{totalScore}</td>
        <td>
          {ratings && ratings?.length !== 0
            ? convertArrtoString(ratings)
            : null}
        </td>
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
            <th>Status</th>
            <th>Total Duration</th>
            <th>Total Score</th>
            <th>Ratings</th>
          </tr>
        </thead>
        <tbody>
          {liveRanking
            ? currentPageData?.map((session) => (
                <>
                  <SessionTableRow key={session?._id} session={session} />
                </>
              ))
            : null}
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
