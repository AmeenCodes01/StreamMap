import React, { useState } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { useSocketContext } from "../context/SocketContext";
import { toast, Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
function StreamVid() {
  const [link, setLink] = useState();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState();
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [title, setTitle] = useState();
  const { socket } = useSocketContext();
  const { id: room } = useParams();

  const onClick = () => {
    //save to localstorage
    setVisible(true);
  };
  const onChange = () => {
    setVisible(false);
  };

  const onSend = () => {
    if (mode) {
      if (title && (hours || minutes)) {
        socket?.emit("display-message", {
          label: "time",
          hours,
          minutes,
          room,
          offset:  5.5
          //- new Date().getTimezoneOffset()/60
        });
      } else {
        console.log("rerer");
        toast.error("cannot display a blank message");
      }
    } else {
      if (title && message) {
        socket?.emit("display-message", { label: "message", message });
      } else {
        console.log("rerer");                                                                                                       
      }
    }
  };

  
  return (
    <div className="p-[10px] flex flex-col w-[100%] h-[100%]  ">
      {!visible ? (
        <>
          {" "}
          <div className="flex flex-row gap-[15px] ">
            <input
              type="text"
              placeholder='share>embed copy inside src="" '
              className="input input-xs input-bordered w-[200px] max-w-xs mb-[5px]"
              onChange={(e) => setLink(e.target.value)}
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
      ) : null}
      {visible && (
        <>
          <iframe
            className="rounded-[20px] aspect-video	  "
            src={link}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
          <div className="flex flex-row w-[100%] space-between justify-between mt-[5px]">
            <p className="text-xs self-center  text-warning">
              Don't forget to give it a like & comment :){" "}
            </p>
            <button
              className="btn btn-xs btn-accent w-[50px] flex self-end "
              onClick={onChange}
            >
              change{" "}
            </button>
          </div>
        </>
      )}
      {/* Show this time to all users.  */}
      {showMessage ? (
        <div className="flex  flex-col  gap-[5px] w-[200px] max-w-[400px] bg-base-300 rounded p-[20px]">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" text-center bg-secondary w-full    self-center focus:outline-none"
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
            <div className="flex flex-row gap-[8px] self-center">
              <input
                type="text"
                value={hours}
                onChange={(e) =>
                  /^\d*$/.test(e.target.value) ? setHours(e.target.value) : null
                }
                className="w-[30px] text-center bg-secondary    focus:outline-none"
              />
              <span>h</span>
              <input
                type="text"
                value={minutes}
                onChange={(e) =>
                  /^\d*$/.test(e.target.value)
                    ? setMinutes(e.target.value)
                    : null
                }
                className="w-[30px]  text-center bg-secondary   focus:outline-none"
              />
              <span>m</span>
            </div>
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
      <span
        className="text-xs italic cursor-pointer text-info hover:mouse-click "
        onClick={() => setShowMessage(!showMessage)}
      >
        {!showMessage ? "display message/time to all clients ?" : "hide"}{" "}
      </span>
      {
        <div className="w-full h-full z-[100000000]">
          <Toaster />
        </div>
      }
    </div>
  );
}

export default StreamVid;
