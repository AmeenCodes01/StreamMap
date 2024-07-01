import React, {useEffect, useState} from "react";
import {TiTick} from "react-icons/ti";
import {SessionTable} from "./SessionTable";
import {useParams} from "react-router-dom";
import useSaveSession from "../hooks/useSaveSession";
import useGetSessions from "../hooks/useGetSessions";
import useListenSessions from "../hooks/useListenSession";
import {useSocketContext} from "../context/SocketContext";
import  useStore  from "../context/TimeStore";
import useSaveScore from "../hooks/useSaveScore";
import {useHealthContext} from "../context/HealthContext";
import {useLeaderBoardContext} from "../context/LeaderBoardContext";
import useAuthId from "../hooks/useAuthId";
function Sessions() {
  // const {mode, workMinutes} = useTimeContext();
  const [seshRating, setSeshRating] = useState(100);
  const [seshCount, setSeshCount] = useState(0);
  const {id: room} = useParams();
  const {saveSession, loading} = useSaveSession();
  const {userSessions, loading: load} = useGetSessions();
  const {
    inSesh,
    setInSesh,
    seshInfo,
    setSeshInfo,
    seshGoal,
    setSeshGoal,
    showRating,
    setShowRating,
    mode, 
    workMinutes,
    isStopWatchActive,
    isCountDownActive
  } = useStore(
    state =>({
      inSesh: state.inSesh ,
    setInSesh: state.setInSesh ,
    seshInfo: state.seshInfo,
    setSeshInfo: state.setSeshInfo ,
    seshGoal: state.seshGoal ,
    setSeshGoal: state.setSeshGoal ,
    showRating: state.showRating ,
    setShowRating: state.setShowRating ,
    mode : state.mode, 
    workMinutes : state.workMinutes,
    isStopWatchActive: state.isStopWatchActive,
    isCountDownActive: state.isCountDownActive
    })
  );
  const {socket} = useSocketContext();
  const {mood} = useHealthContext();
  const {saveScore} = useSaveScore();
  const {authId} = useAuthId()
  // const {rankings, setRankings} = useLeaderBoardContext()
  useEffect(() => {
    socket?.on("newSession", (newSession) => {
      // newMessage.shouldShake = true;
      // const sound = new Audio(notificationSound);
      // sound.play();

  if (newSession.userId == authId) {
        setSeshInfo([...seshInfo, newSession]);
      }
    });

    return () => socket?.off("newSession");
  }, [socket, seshInfo, setSeshInfo]);

  useEffect(() => {
    setSeshInfo(userSessions);
  }, [userSessions]);

  const onSession = () => {
    // calc session score based on rating & duration.

    const calculateSessionScore = (duration, rating) => {
      // Define weights for duration and rating
      const durationWeight = 0.1; // Adjust as needed
      const ratingWeight = 0.5; // Adjust as needed

      // Calculate the score

      // Combine duration and rating scores
      const totalScore = duration * durationWeight + ratingWeight * rating;

      // Round the total score to the nearest integer
      return Math.round(totalScore);
    };
    const score = calculateSessionScore(workMinutes, seshRating);

    const session = {
      sessionNumber: seshCount,
      rating: seshRating,
      goal: seshGoal,
      duration: workMinutes,
      room,
      timers: inSesh,
      mood,
      score,
    };
    saveScore(score, room, authId);

    saveSession(session);
    setShowRating(false);
    setInSesh([]);
    setSeshInfo([...seshInfo, session]);
    setSeshGoal();

    setSeshCount(seshCount + 1);
   
  };

  useListenSessions();

  if (load || loading) {
    return <div className="skeleton w-32 h-32"></div>;
  }

  return (
    <div className="flex w-[100%] items-end flex-col justify-items-end mt-[20px] ">
      {/* <ListenSessions seshInfo={seshInfo} setSeshInfo={setSeshInfo} /> */}
      <div className="w-[100%] justify-items-end">
        <div className="flex flex-col mb-[20px]  ">
          {/* { mode === "work"  ? ( */}
          <div className=" ml-auto">
            <div className="flex md:flex-row flex-col ml-auto  ">
              <p className="flex flex-row w-[300px] text-end self-center justify-self-end  tracking-wide font-serif font-[16px]">
                In these {workMinutes} min, I will
              </p>
              <input
                className="w-[100%] self-start  placeholder:text-md h-auto border-bottom border-1px px-[5px] py-[2px] md:ml-[15px] mt-[10px]  border-secondary focus:outline-none "
                value={seshGoal}
                onChange={(e) => setSeshGoal(e.target.value)}
                style={{
                  height: "30px",
                  transition: "height 0.5s",
                  padding: "5px",
                }}
                placeholder="your goal for this session"
              />
              {/* <input
            value={seshGoal}
            style={{
              height: "30px",
              transition: "height 0.5s",
              padding: "5px",
            }}
            placeholder="your goal for this session"
            className="text-start h-[full] text-info w-[100%] focus:outline-none mr-[3px] input input-info w-full max-w-xs pl-[5px]"
            onChange={(e) => setSeshGoal(e.target.value)}
          /> */}
            </div>
            {showRating && (!isStopWatchActive && !isCountDownActive) ? (
              <div className="flex flex-row mt-[10px] border-[10] ml-[auto] mr-[50px] ">
                <p className="text-center self-center mr-[5px] md:text-[18px] italic">
                  rate your session :
                </p>
                <input
                  type="text"
                  value={seshRating}
                  maxLength={3}
                  className="input input-bordered text-warning text-center p-[2px] input-warning max-w-xs w-[50px]  h-[30px] focus:outline-none"
                  onChange={(e) => {
                    const regex = /^[0-9\b]+$/;
                    if (
                      (e.target.value === "" || regex.test(e.target.value)) &&
                      e.target.value < 11
                    ) {
                      e.target.value < 11
                        ? setSeshRating(e.target.value)
                        : null;
                    }
                  }}
                />
                <p className="text-center flex self-center pl-[5px] "> /10</p>
                <TiTick
                  size={30}
                  className=" self-center ml-[5px] h-[30px]"
                  onClick={onSession}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Sessions);

//To put it simply, I record livestream start time, get all sessions since then, add score by myself based on these
//and then rank them, display them.
//When new session comes, I will simply add to state and re rank.
//........display time.
//setShowRating to true when the inSesh timers stop running. 