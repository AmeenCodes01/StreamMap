import {useState, useEffect} from "react";
import {useSocketContext} from "../../context/SocketContext";
import {setInterval, clearInterval} from "worker-timers";

const RankingTimer = ({duration, status}) => {
  // const timerKey = `timer_${sessionID}`; // Generate a unique key for each timer
  // console.log(end, "end");
  // // // Calculate the elapsed time in seconds
  // const elapsedTime = (Date.now() - Date.parse(createdAt)) / 1000;

  // // // Calculate the remaining time
  // const remainingTime = duration * 60 - elapsedTime;
  // const savedIsActive = JSON.parse(
  //   localStorage.getItem(`${timerKey}_isActive`)
  // );
  console.log(status, "status");
  // // Initialize state with the remaining time
  // const [isActive, setIsActive] = useState(
  //   savedIsActive !== null ? savedIsActive : true
  // );
  // const [timeLeft, setTimeLeft] = useState(remainingTime);
  // useEffect(() => {
  //   // Store the isActive state in local storage whenever it changes
  //   localStorage.setItem(`${timerKey}_isActive`, JSON.stringify(isActive));
  // }, [isActive, timerKey]);

  // const {socket} = useSocketContext();

  // useEffect(() => {
  //   let interval;

  //   if (isActive) {
  //     interval = setInterval(() => {
  //       setTimeLeft((prevTimeLeft) => {
  //         const newTimeLeft = prevTimeLeft - 1;

  //         if (newTimeLeft <= 0) {
  //           clearInterval(interval);
  //           return 0;
  //         }
  //         return newTimeLeft;
  //       });
  //     }, 1000); // Update every second
  //   }

  //   return () => clearInterval(interval);
  // }, [isActive, timerKey]);

  // useEffect(() => {
  //   socket.on("paused-session", ({id, pause}) => {
  //     console.log("id", id, pause);
  //     // Pause the timer if the session ID matches
  //     if (id === sessionID) {
  //       setIsActive(!pause);
  //       console.log(isActive);
  //     }
  //   });

  //   return () => {
  //     socket.off("paused-session");
  //   };
  // }, [socket]);
  // let minutes;
  // let seconds;

  // if (!isNaN(remainingTime)) {
  //   minutes = Math.floor(timeLeft / 60)
  //     .toString()
  //     .padStart(2, "0");
  //   seconds = Math.floor(timeLeft % 60)
  //     .toString()
  //     .padStart(2, "0");
  // } else {
  //   minutes = "00";
  //   seconds = "00";
  // }

  // const percentage = Math.round((1 - timeLeft / (duration * 60)) * 100);
  // console.log(percentage, "pec");
  return (
    <>
      <div
        style={{textAlign: "center"}}
        className={`${
          status === "end" || undefined
            ? "bg-error"
            : status === "start"
            ? "bg-success"
            : "bg-warning"
        } text-white`}
      >
        {status === "end" || undefined ? <span>break</span> : null}
        {status === "start" && <span>start</span>}
        {status === "pause" && <span>paused</span>}

        {/* {remainingTime < 0 && <p>END</p>} */}
        {/* {percentage !== 100 && !isNaN(percentage) ? (
        <>
        <div style={{marginBottom: "10px"}}>
        <span>{`${minutes}:${seconds}`}</span>
        </div>
        <progress
        className={`progress w-[100%]  progress-primary 
        }`}
        value={isNaN(percentage) ? 0 : parseInt(percentage)}
        max="100"
        ></progress>
        </>
        ) : (
          <span className="flex-start flex">break</span>
          )} */}
      </div>
      {/* <div className=" mt-[2px]">total: {duration}</div> */}
    </>
  );
};

export default React.memo(RankingTimer);
