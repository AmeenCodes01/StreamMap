import React, { useState, useEffect } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { useSocketContext } from "../context/SocketContext";
import toast from "react-hot-toast";
import { useLiveStream } from "../hooks/useLiveStream";
import { useAuthContext } from "../context/AuthContext";
import YouTube from "react-youtube";
import useAuthId from "../hooks/useAuthId";

function StreamVid() {
  const { room, key } = useAuthId();
  const [visible, setVisible] = useState(localStorage.getItem(`${key}link`) !=="" ? true :false);
  const [mode, setMode] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [link, setLink] = useState(localStorage.getItem(`${key}link`) || "");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const { socket, setLive, live, setLiveLink, liveLink } = useSocketContext();
  const { startLive, endLive, checkLive } = useLiveStream();
  const { authUser } = useAuthContext();
console.log(link,"Link", localStorage.getItem(`${key}link`),liveLink)


  const onClick = () => {
    //save to localstorage
    localStorage.setItem(`${key}link`, link);
    setVisible(true);
    // if (live && authUser.adminRoom === room) {
    //   socket.emit("live", { live, room, newStream:{ link} });
    //   setLiveLink(link);
    // }
  };
//undefined when goes live
  const onChange = () => {
    setVisible(false);
  };

  useEffect(() => {
    const checkForLive = async () => {
      if (room) {
        const data = await checkLive(room);
        if (data) {
          setLive(data.live);
          if (data.live) setLink(data.link);
          setVisible(true);
        }
      }
    };

    checkForLive();
  }, []);

  useEffect(() => {
    console.log("beep")
    if (live && authUser.adminRoom !== room) {
      console.log(liveLink,"liveLink")
      setLink(liveLink);
      localStorage.setItem(`${key}link`, liveLink);
    }
  }, [live]);

  // useEffect(() => {
  // setLiveLink(localStorage.getItem(`${key}link`))
  // }, []);

  const onLive = () => {
    setLive((prevLive) => {
      const newLive = !prevLive;
      //on every refresh, it can just check if live or not through API.
      if (socket === null) return;
      //if turning on live, link needed.
      if (prevLive === false) {
        if (link) {
          startLive(room, link);
          socket.emit("live", { live: newLive, room, link });
          return newLive;
        } else {
          toast.error("please provide a link to your live");
          return prevLive;
        }
      } else {
        endLive(room);
        setVisible(false);

        socket.emit("live", { live: newLive, room });

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
        socket?.emit("display-message", {
          label: "message",
          message,
          room,
          title,
        });
      } else {
        toast.error("title & message not provided. ");
      }
    }
    setShowMessage(false);
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  function extractVideoId(url) {
    if (!url) return null;

    // Regular expressions for different YouTube URL formats
    const regexps = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^/?]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^/?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^/?]+)/,
    ];

    for (let regex of regexps) {
      const match = url.match(regex);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

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
          <>
            <div className="flex flex-row gap-[15px] ">
              <input
                type="text"
                value={link}
                placeholder='paste link here '
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
              make sure the link is pasted properly!
            </p>{" "}
          </>
        </>
      ) : null}

      {visible ? (
        <>
        
          <div className="  aspect-video">
            <YouTube
              videoId={ extractVideoId(link)}
              opts={opts}
              className="flex  "
             
              onReady={(event) => {
                const savedTime = localStorage.getItem(`youtube-time-link`);
                event.target.seekTo(parseFloat(savedTime));
                event.target.playVideo();
              }}
              onPause={(event) =>
                localStorage.setItem(
                  `youtube-time-link`,
                  event.target.getCurrentTime()
                )
              }
            />
          </div>

          <div className="flex flex-row w-[100%] space-between justify-between mt-[5px]">
            <p className="text-xs self-center  text-warning">
              Don't forget to give it a like & comment :){" "}
            </p>
              <>
                <button
                  className="btn btn-xs btn-accent w-[50px] flex self-end "
                  onClick={onChange}
                >
                  change{" "}
                </button>
              </>
          </div>
        </>
      ) : null}

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
      ) : null}
      {<div className="w-full h-full z-[100000000]"></div>}
    </div>
  );
}

export default React.memo(StreamVid);
