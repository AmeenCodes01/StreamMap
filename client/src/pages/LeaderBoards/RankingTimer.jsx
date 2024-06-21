import { useState, useEffect } from "react";
import { useSocketContext } from "../../context/SocketContext";

const RankingTimer = ({ duration, id: sessionID, createdAt }) => {
    const timerKey = `timer_${sessionID}`; // Generate a unique key for each timer
  
    // Calculate the elapsed time in seconds
    const elapsedTime = (Date.now() - Date.parse(createdAt)) / 1000;
    
    // Calculate the remaining time
    const remainingTime = duration - elapsedTime;
    const savedIsActive = JSON.parse(localStorage.getItem(`${timerKey}_isActive`));
    // Initialize state with the remaining time
    const [isActive, setIsActive] = useState(savedIsActive !== null ? savedIsActive : true);  
    const [timeLeft, setTimeLeft] = useState(remainingTime);
    useEffect(() => {
      // Store the isActive state in local storage whenever it changes
      localStorage.setItem(`${timerKey}_isActive`, JSON.stringify(isActive));
    }, [isActive, timerKey]);
    
    const { socket } = useSocketContext();
  
    useEffect(() => {
      let interval;
  
      if (isActive) {
        interval = setInterval(() => {
          setTimeLeft((prevTimeLeft) => {
            const newTimeLeft = prevTimeLeft - 1;
  
            if (newTimeLeft <= 0) {
              clearInterval(interval);
              return 0;
            }
            return newTimeLeft;
          });
        }, 1000); // Update every second
      }
  
      return () => clearInterval(interval);
    }, [isActive, timerKey]);      
  
    useEffect(() => {
      socket.on("paused-session", ({id, pause}) => {
        console.log("id", id , pause)
        // Pause the timer if the session ID matches
        if (id === sessionID) {
          setIsActive(!pause);
          console.log(isActive)
        }
      });
  
      return () => {
        socket.off("paused-session");
      };
    }, [socket]);
  
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = Math.floor(timeLeft % 60).toString().padStart(2, "0");
    const percentage = Math.round((1 - (remainingTime / duration)) * 100);

    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "10px" }}>
          <span>{`${minutes}:${seconds}`}</span>
        </div>
        <div style={{ height: "10px", backgroundColor: "lightgray", borderRadius: "5px", width: "100%" }}>
          <div style={{ height: "100%", width: `${percentage}%`, backgroundColor: "green", borderRadius: "5px" }}></div>
        </div>
      </div>
    );
  };

  export default RankingTimer