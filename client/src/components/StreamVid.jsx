import React, {useState, useEffect} from "react";
import {IoCheckmarkDone} from "react-icons/io5";
import {useSocketContext} from "../context/SocketContext";
import toast from "react-hot-toast";
import {useParams} from "react-router-dom";
import DisplayMessage from "./DisplayMessage";
import {useLiveStream} from "../hooks/useLiveStream";
import {AuthContext, useAuthContext} from "../context/AuthContext";
function StreamVid() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const {socket, setLive, live, setLiveLink, liveLink} = useSocketContext();
  const {id: room} = useParams();
  const {startLive, endLive} = useLiveStream();
  const {authUser} = useAuthContext();
  const onClick = () => {
    console.log("clicked");
    //save to localstorage
    setLiveLink(link);
    setVisible(true);
  };

  const onChange = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (liveLink !== "") {
      setVisible(live);
    }
  }, [liveLink]);

  const onLive = () => {
    setLive((prevLive) => {
      const newLive = !prevLive;
      //on every refresh, it can just check if live or not through API.
      if (socket === null) return;
      //if turning on live, link needed.
      if (prevLive === false) {
        if (liveLink) {
          startLive(room, liveLink);
          socket.emit("live", {live: newLive, room, link: liveLink});
          return newLive;
        } else {
          toast.error("please provide a link to your live");
          return prevLive;
        }
      } else {
        endLive(room);
        setVisible(false);

        socket.emit("live", {live: newLive, room});

        return newLive;
      }
    });
  };

  const onSend = () => {
    if (mode) {
      if (title && date) {
        socket?.emit("display-message", {
          label: "time",
          room,
          date,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          title,
        });
      } else {
        toast.error("cannot display a blank message");
      }
    } else {
      if (title && message) {
        console.log("display message socket io");
        socket?.emit("display-message", {
          label: "message",
          message,
          room,
          title,
        });
      } else {
        console.log("title & message not provided. ");
      }
    }
    setShowMessage(false);
  };


  function convertYouTubeLinkToEmbed(linke) {
    const link = toString(linke)
    // Extract the video ID from the YouTube URL
    const videoId = link.match(/(?:youtube\.com\/watch\?v=|youtu.be\/)([^&]+)/)[1];
  
    // Construct the embed URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
    // Create the iframe embed code
    const embedCode = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
  
    return embedUrl;
  }
console.log(room)
  return (
    <div className="p-[10px] flex flex-col w-[100%] h-[100%]  ">
      <div className="flex flex-row gap-[10px] mb-[15px] ">
        <p>Live </p>
        <input
          type="checkbox"
          checked={live}
          className="toggle toggle-sm self-center"
          disabled={
            authUser.admin === true && authUser.adminRoom === room
              ? false
              : true
          }
          onChange={() => {
            onLive();
          }}
        />
      </div>

      {!visible ? (
        <>
          {/* {authUser.admin ? ( */}
          <>
            <div className="flex flex-row gap-[15px] ">
              <input
                type="text"
                value={link }
                placeholder='share>embed copy inside src="" '
                className="input input-xs input-bordered w-[200px] max-w-xs mb-[5px]"
                onChange={(e) => {
                  setLink(e.target.value);
                }} 
                // send link to all in room.
              />
              <IoCheckmarkDone
                size={20}
                className="self-center"
                onClick={onClick}
              />
            </div>
            <p className="text-xs text-error mb-[20px]">
              {" "}
              make sure the src link is pasted properly!
            </p>{" "}
          </>
          {/* ) : null} */}
        </>
      ) : null}

      {visible && (
        <>
          <iframe
            className="rounded-[20px] aspect-video"
            src={(liveLink)}
            title="YouTube video player"
          ></iframe>
          <div className="flex flex-row w-[100%] space-between justify-between mt-[5px]">
            <p className="text-xs self-center  text-warning">
              Don't forget to give it a like & comment :){" "}
            </p>
            {authUser.admin === true && authUser.adminRoom === room  || room==="Test" ? (
              <button
                className="btn btn-xs btn-accent w-[50px] flex self-end "
                onClick={onChange}
              >
                change{" "}
              </button>
            ):null}{" "}
          </div>
        </>
      )}
      {/* Show this time to all users.  */}
      {authUser.admin === true && authUser.adminRoom === room && showMessage ? (
        <div className="flex  flex-col  gap-[5px] w-[200px] max-w-[400px] bg-base-300 rounded p-[20px] ">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" text-center bg-secondary w-full self-center focus:outline-none"
          />{" "}
          <div className="flex flex-row gap-[10px]">
            <span className="text-xs">click to change mode </span>
            <label className="swap self-end">
              <input
                type="checkbox"
                value={mode}
                className="  "
                onChange={(e) => setMode(!mode)}
              />
              <div className="swap-on text-xs text-info ">text</div>
              <div className="swap-off text-xs text-info ">time</div>
            </label>
          </div>
          {mode ? (
            <input
              aria-label="Date and time"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          ) : (
            <textarea
              className="textarea textarea-secondary bg-secondary placeholder:text-xs"
              placeholder="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          )}
          <button
            className="btn btn-xs btn-secondary mt-[5px]"
            onClick={onSend}
          >
            display
          </button>
        </div>
      ) : null}
      {authUser.admin === true && authUser.adminRoom === room ? (
        <button
          className="text-xs italic cursor-pointer text-secondary-content hover:mouse-click bg-secondary text-start self-start rounded-[6px]   "
          onClick={() => setShowMessage(!showMessage)}
        >
          {!showMessage ? "display message/time to all clients " : "hide"}{" "}
        </button>
      ):null}
      {<div className="w-full h-full z-[100000000]"></div>}
    </div>
  );
}

export default React.memo(StreamVid);
