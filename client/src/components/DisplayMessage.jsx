import {useEffect, useState} from "react";
import {useSocketContext} from "../context/SocketContext";
import {fromZonedTime, toZonedTime, format} from "date-fns-tz";
import {parseISO} from "date-fns";
function DisplayMessage() {
  const {socket} = useSocketContext();
  const [message, setMessage] = useState("");
  const [time, setTime] = useState();
  const [title, setTitle] = useState("");
  function convertAndFormatDate(inputDate, inputTimezone, targetTimezone) {
    // Parse the input date
    const parsedDate = parseISO(inputDate);

    // Convert to UTC, considering the input timezone
    const utcDate = fromZonedTime(parsedDate, inputTimezone);

    // Convert UTC to the target timezone
    const dateInTargetTimezone = toZonedTime(utcDate, targetTimezone);

    // Format the result
    return format(dateInTargetTimezone, "h:mm a, MMMM d, yyyy", {
      timeZone: targetTimezone,
    });
  }

  useEffect(() => {
    const handler = (e) => {
      console.log(e, "received message");
      if (e.label === "time") {
        const localTime = convertAndFormatDate(e.date, e.timeZone);
        console.log(localTime);
        setTime(localTime);

        // setTime({
        //   hours: localTime.hours,
        //   minutes: localTime.minutes,
        // });
      }
      if (e.label === "message") {
        setMessage(e.message);
      }
      setTitle(e.title);
    };

    socket?.on("stream-message", handler);

    // Cleanup function to remove the event listener
    return () => {
      socket?.off("stream-message", handler);
    };
  }, [socket]); // Add socket to the dependency array

  return (
    <div className=" ml-auto flex mr-auto text-md italic">
      {title} : {message ? message : time ? time : null}{" "}
    </div>
  );
}

export default DisplayMessage;
