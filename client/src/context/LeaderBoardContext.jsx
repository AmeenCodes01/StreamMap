import {createContext, useContext, useState, useEffect} from "react";
import useGetRoomRankings from "../hooks/useGetRoomRankings";
import {useParams} from "react-router-dom";
import {useSocketContext} from "./SocketContext";

export const LeaderBoardContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLeaderBoardContext = () => {
  return useContext(LeaderBoardContext);
};
export const LeaderBoardContextProvider = ({children}) => {
  const [rankings, setRankings] = useState([]);
  const [liveRanking, setLiveRanking] = useState([]);
  const {id: room} = useParams();
  const {socket} = useSocketContext();
  const {getRankings, loading, getLiveRankings} = useGetRoomRankings();
  const {live} = useSocketContext();

  useEffect(() => {
    const getRanking = async () => {
      const data = await getRankings(room);
      if (data) setRankings(data);
    };

    //getRanking();
  }, [room]); // Added room to dependency array

  useEffect(() => {
    const getLiveRanking = async () => {
      const data = await getLiveRankings(room);
      if (data) {
        console.log(data, "liveankinfDATA  ");
        // Create an array with 100 copies of the 'data' object
        // Set the 'repeatedData' to the 'liveRanking'
        setLiveRanking(data);
      }
    };
    if (live) {
      getLiveRanking();
    }
  }, [live, room]);

  useEffect(() => {
    const handler = (sesh) => {
      setLiveRanking((prevLiveRanking) => {
        prevLiveRanking = Array.isArray(prevLiveRanking) ? prevLiveRanking : [];
        // Check if the session already exists in the state
        const existingSessionIndex = prevLiveRanking?.findIndex(
          (session) => session.userId === sesh.userId
        );
        sesh.end = false;
        // If it exists, update the existing session
        if (existingSessionIndex !== -1 && prevLiveRanking) {
          const updatedRanking = [...prevLiveRanking];
          updatedRanking[existingSessionIndex] = {
            ...updatedRanking[existingSessionIndex],
            ...sesh,
          };
          return updatedRanking;
        } else {
          // If it doesn't exist, add the new session
          const updatedRanking = [...prevLiveRanking, sesh];

          return updatedRanking;
        }
      });
    };
    if (socket) {
      socket.on("start-sessions", handler);
      return () => {
        socket.off("start-sessions", handler);
      };
    }
  }, [socket]); // Added socket to dependency array

  useEffect(() => {
    const handler = ({id, pause}) => {
      setLiveRanking((prevLiveRanking) => {
        prevLiveRanking = Array.isArray(prevLiveRanking) ? prevLiveRanking : [];

        const updatedRanking = prevLiveRanking?.map((sesh) => {
          if (sesh._id === id) {
            return {
              ...sesh,
              status: pause == true ? "pause" : "start",
            };
          }
          return sesh;
        });
        return updatedRanking;
      });
    };
    if (socket) {
      socket.on("paused-session", handler);
      return () => {
        socket.off("paused-session", handler);
      };
    }
  }, [socket]);

  //simple logic of resetting is that remove timer, title, set time to 00:00. everything else remians same.
  useEffect(() => {
    const handler = ({id}) => {
      setLiveRanking((prevLiveRanking) => {
        // Check if the session already exists in the state
        //but it already should.
        prevLiveRanking = Array.isArray(prevLiveRanking) ? prevLiveRanking : [];

        const existingSessionIndex = prevLiveRanking?.findIndex(
          (session) => session?._id === id
        );
        // If it exists, update the existing session
        if (existingSessionIndex !== -1) {
          const updatedRanking = [...prevLiveRanking];
          const session = updatedRanking[existingSessionIndex];
          updatedRanking[existingSessionIndex] = {
            totalDuration: session.totalDuration || 0,
            totalScore: session.totalScore || 0,
            userId: session.userId,
            status: "end",
            name: session.name,
          };

          return updatedRanking;
        }
        //else {
        //   // If it doesn't exist, add the new session  ?
        //   const updatedRanking = [...prevLiveRanking, session];
        //   return updatedRanking;
        // }
      });
    };

    if (socket) {
      socket.on("reset-session", handler);
      return () => {
        socket.off("reset-session", handler);
      };
    }
  }, [socket]);

  // Added socket to dependency array

  //on pause, send session id to socket, which will emit it to all clients, the client will take it and add pause to status , also update sessions obj.

  useEffect(() => {
    const handler = (sesh) => {
      setLiveRanking((prevLiveRanking) => {
        prevLiveRanking = Array.isArray(prevLiveRanking) ? prevLiveRanking : [];

        const updatedRanking = prevLiveRanking?.map((session) => {
          if (session?.userId === sesh?.userId) {
            let newRatings;
            if(session.ratings){

               newRatings = [ sesh.rating,...session.ratings];
            }else{
               newRatings = [sesh.rating]
            }
            return {
              ...session,
              //   goal: session.goal == "" ? sesh.goal : session.goal,
              totalScore: (session.totalScore || 0) + sesh.score,
              totalDuration: (session.totalDuration || 0) + sesh.duration,
              rating: sesh.rating,
              status: "end",
              ratings: newRatings,
            };
          }
          return session;
        });

        // Sort the updatedRanking array by score in descending order
        updatedRanking.sort((a, b) => (b.score || 0) - (a.score || 0));

        return updatedRanking;
      });
    };
    if (socket) {
      socket.on("end-sessions", handler);
      return () => {
        socket.off("end-sessions", handler);
      };
    }
  }, [socket]);

  return (
    <LeaderBoardContext.Provider
      value={{rankings, setRankings,     liveRanking: liveRanking || []
        , setLiveRanking}}
    >
      {children}
    </LeaderBoardContext.Provider>
  );
};
//liveRanking{userId, score, goal}
//active{seshID,userID,goal}
//after rating received for this sesh, send up to ranked.
//ok so we will wait for socket to send in current array, add a isActive, if so, have goal & duration.
//after rating recieval, add to current score and duration. re rank the state.

//so when new session starts, if session for that user already exists,  update duration & goal & status.
//when session ends, update its score & totalDuration (totalDuration + duration) & status.
//when new session comes, if that user doesnt already exist, then just add the whole sess.
//replace when new come with userID
