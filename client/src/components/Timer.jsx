import React, {useEffect, useState, useRef} from "react";
import {CircularProgressbar, buildStyles} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {LuTimerReset} from "react-icons/lu";
import {FaPlayCircle, FaPauseCircle} from "react-icons/fa";
import {useSocketContext} from "../context/SocketContext";
import useAuthId from "../hooks/useAuthId";
import {useShallow} from "zustand/react/shallow";
import {Progress} from "react-daisyui";
import {setInterval, clearInterval} from "worker-timers";
import useStore from "../context/TimeStore";
import usePomodoro from "../hooks/usePomodoro";
import timerEnd from "/timerEnd.mp3";
const red = "#f54e4e";

export default function Timer() {
  const {
    workMinutes,
    setWorkMinutes,
    isPaused,
    setIsPaused,
    mode,
    setMode,
    isRunning,
    setIsRunning,
    seshGoal,
    setShowRating,
    secondsLeft,
    setSecondsLeft,
    breakMinutes,
    setBreakMinutes,
    isStopWatchActive,
    isCountDownActive,
    resetInSesh,
    rated,
    setRated,
  } = useStore(
    useShallow((state) => ({
      workMinutes: state.workMinutes,
      setWorkMinutes: state.setWorkMinutes,
      isPaused: state.isPaused,
      setIsPaused: state.setIsPaused,
      mode: state.mode,
      setMode: state.setMode,
      isRunning: state.isRunning,
      setIsRunning: state.setIsRunning,
      seshGoal: state.seshGoal,
      setShowRating: state.setShowRating,
      secondsLeft: state.secondsLeft,
      setSecondsLeft: state.setSecondsLeft,
      breakMinutes: state.breakMinutes,
      setBreakMinutes: state.setBreakMinutes,
      isStopWatchActive: state.isStopWatchActive,
      isCountDownActive: state.isCountDownActive,
      timeElapsed: state.timeElapsed,
      setTimeElapsed: state.setTimeElapsed,
      resetInSesh: state.resetInSesh,
      rated: state.rated,
      setRated: state.setRated,
    }))
  );

  const {authId, key, room} = useAuthId();
  const [disabled, setDisabled] = useState(false);
  const {start, pause} = usePomodoro();
  const audio = document.getElementById("audio_tag");
  const [play, setPlay] = useState(false);

  useEffect(() => {
    // Retrieve necessary localStorage values

    setWorkMinutes(parseInt(localStorage.getItem(`${key}workMinutes`)) || 60);
    setBreakMinutes(parseInt(localStorage.getItem(`${key}breakMinutes`)) || 10);

    const storedStartTime = localStorage.getItem(`${key}startTime`);
    const storedIsRunning = localStorage.getItem(`${key}isRunning`) === "true";
    const workMinutes =
      parseInt(localStorage.getItem(`${key}workMinutes`)) || 60;
    const breakMinutes =
      parseInt(localStorage.getItem(`${key}breakMinutes`)) || 10;
    const pausedTime =
      localStorage.getItem(`${key}PausedTime`) || workMinutes * 60;
    const mode = localStorage.getItem(`${key}mode`) || "work";

    setMode(mode);
    setWorkMinutes(workMinutes);
    setBreakMinutes(breakMinutes);
    setRated(localStorage.getItem(`${key}rated`) === "true" || false);
    // if any ls value is null, set it to workMinutes
    // Calculate elapsedTime based on storedStartTime
    const elapsedTime = (Date.now() - storedStartTime) / 1000;

    // Calculate remainingTime using the correct values
    let remainingTime =
      (mode == "work" ? workMinutes : breakMinutes) * 60 - elapsedTime;

    if (storedStartTime == null) {
      remainingTime = workMinutes * 60;
    }

    setIsPaused(localStorage.getItem(`${key}isPaused`) === "true");
    // Update state with the correct values
    setSecondsLeft(
      localStorage.getItem(`${key}isPaused`) === "true"
        ? pausedTime
        : remainingTime > 0
        ? remainingTime
        : workMinutes * 60
    );
  }, []);
  const [sessions, setSessions] = useState(
    parseInt(localStorage.getItem(`${key}sessions`)) || 0
  );

  const {socket} = useSocketContext();

  const toggle = mode === "break";

  function tick() {
    setSecondsLeft(secondsLeft - 1 < 0 ? 0 : secondsLeft - 1);
  }

  //get createdAt time.

  useEffect(() => {
    function switchMode() {
      audio.play();
      const nextMode = mode === "work" ? "break" : "work";
      console.log(nextMode, "mextMODE");
      nextMode === "break" ? setShowRating(true) : null;
      if (nextMode === "work" && rated === false) {
        setIsPaused(true);
        setDisabled(true);
      }
      const nextSeconds =
        (nextMode === "work" ? workMinutes : breakMinutes) * 60;
      setSessions((prevSessions) => {
        return parseInt(prevSessions) + (mode === "work" ? 1 : 0);
      });
      setMode(nextMode);
      localStorage.setItem(`${key}mode`, nextMode);

      setSecondsLeft(nextSeconds);
      localStorage.setItem(`${key}startTime`, Date.now());
      if ((isStopWatchActive || isCountDownActive) && nextMode == "break") {
        setIsPaused(true);
        setDisabled(true);
        localStorage.setItem(`${key}PausedTime`, nextSeconds);
      }
    }

    if (isRunning) {
      const interval = setInterval(() => {
        if (!isPaused && secondsLeft > 0) {
          tick();
          //when session timer ends, progress asked only then. hidden while session ongoing. a new state. when session ends
        } else if (secondsLeft === 0) {
          switchMode();
          // localStorage.removeItem(`${key}startTime`);
        }
      }, 1000); // Change interval to 1000 milliseconds (1 second)

      return () => clearInterval(interval);
    }
  }, [workMinutes, breakMinutes, mode, isPaused, secondsLeft, isRunning]);

  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = Math.floor(secondsLeft % 60);
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);
  console.log(totalSeconds);
  console.log(isRunning, isPaused);
  console.log(secondsLeft);

  const onResetTimer = () => {
    localStorage.removeItem(`${key}startTime`);
    localStorage.removeItem(`${key}PausedTime`);

    setShowRating(false);
    mode === "work" && secondsLeft !== workMinutes * 60
      ? socket.emit("reset-session", {
          id: localStorage.getItem("sessionID"),
          room,
        })
      : null;

    const resetSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;

    setSecondsLeft(resetSeconds);
    resetInSesh();
    setIsRunning(false);
    setIsPaused(true);
    setRated(false);
  };

  const onToggle = () => {
    setMode(mode === "work" ? "break" : "work");
    localStorage.setItem(`${key}startTime`, Date.now());
    const resetSeconds = (mode === "work" ? breakMinutes : workMinutes) * 60;
    setSecondsLeft(resetSeconds);
  };

  useEffect(() => {
    if (!isCountDownActive && !isStopWatchActive && rated) {
      setDisabled(false);
      console.log(disabled, "datadisabled");
    }
  }, [isCountDownActive, isStopWatchActive, rated]);

  //get all & set. seconds, isRunning,

  useEffect(() => {
    localStorage.setItem(`${key}isPaused`, isPaused);
  }, [isPaused]);

  useEffect(() => {
    localStorage.setItem(`${key}isRunning`, isRunning);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem(`${key}mode`, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(`${key}workMinutes`, workMinutes);
  }, [workMinutes]);

  useEffect(() => {
    localStorage.setItem(`${key}breakMinutes`, breakMinutes);
  }, [breakMinutes]);
  console.log(percentage);
  return (
    <div className="w-[100%] flex flex-col pl-[10px]">
      {/* This will become a timer. */}
      <div className="flex flex-row">
        <input
          value={sessions}
          onChange={(e) => {
            const regex = /^[0-9\b]+$/;
            if (
              (e.target.value === "" || regex.test(e.target.value)) &&
              e.target.value <= 10
            ) {
              setSessions(e.target.value);
            }
          }}
          className="w-[30px] flex text-warning h-[30px] text-lg px-[5px] py-[2px] ml-[5px] border-bottom border-1px text-center border-secondary focus:outline-none "
        />

        <div className="w-[500px] mr-[10px] min-w-[100px]">
          {/* <Progress value={19} className="w-56" /> */}
          <progress
            className={`progress w-56 ${
              mode === "work" ? "progress-success" : "progress-error"
            }`}
            value={100 - percentage}
            max="100"
          ></progress>

          {`${minutes < 10 ? "0" : ""}${minutes}:${
            seconds < 10 ? "0" : ""
          }${seconds}`}
          {/* <CircularProgressbar
            value={percentage}
            strokeWidth={30}
            text={`${minutes < 10 ? "0" : ""}${minutes}:${
              seconds < 10 ? "0" : ""
            }${seconds}`}
            styles={buildStyles({
              strokeLinecap: "butt",
              textSize: "16px",
              pathTransitionDuration: 0.5,
              pathColor:
                mode === "work" ? "oklch(var(--su))" : "oklch(var(--er))",
              textColor: "oklch(var(--nc))",
              trailColor: "#d6d6d6",
              tailColor: red,
            })}
          /> */}
        </div>
        <div className="flex items-center justify-items-center flex-col">
          <div className="flex flex-col p-[10px]">
            {/* //Play button */}
            {isPaused === true || isRunning === false ? (
              <div className="flex flex-row gap-[10px]">
                <button
                  disabled={disabled}
                  className="btn btn-success items-center justify-center"
                  //so I will start(room, workMinutes, )
                  onClick={() => {
                    secondsLeft === workMinutes * 60
                      ? start({
                          room,
                          duration: workMinutes,
                          goal: seshGoal,
                          id: authId,
                        })
                      : start();
                  }}
                >
                  <FaPlayCircle size={15} />
                </button>{" "}
                <button className="btn btn-primary" onClick={onResetTimer}>
                  <LuTimerReset size={15} />
                </button>
              </div>
            ) : null}
            {isPaused == false && isRunning == true ? (
              <button
                className="btn btn-warning items-center justify-center"
                onClick={() => {
                  pause();
                  // setIsPaused(true);
                  // setIsRunning(true);
                  // localStorage.setItem(`${key}PausedTime`, secondsLeft);
                  // localStorage.setItem(`${key}isRunning`, "true");

                  // secondsLeft !== workMinutes * 60 && mode === "work"
                  //   ? socket.emit("paused-session", {
                  //       id: localStorage.getItem(`${key}sessionID`),
                  //       room,
                  //       pause: true,
                  //     })
                  //   : null;
                }}
              >
                <FaPauseCircle size={15} />
              </button>
            ) : null}
          </div>
          <div className="flex flex-col">
            {isPaused && (
              <>
                <div className="h-[80px] px-[5px] items-center align-items-center p-[10px]">
                  <input
                    type="range"
                    value={workMinutes}
                    onChange={(e) => {
                      setWorkMinutes(e.target.value);
                      mode === "work" && setSecondsLeft(e.target.value * 60);
                      localStorage.setItem(`${key}workMinutes`, e.target.value);
                    }}
                    max={120}
                    min={0}
                    // step={5}
                    height={"10px"}
                    className="range range-success range-sm"
                  />
                  <span className="prose text-xs ">
                    Work :{" "}
                    <span className="text-info prose-lg ">
                      {workMinutes} min
                    </span>{" "}
                  </span>
                </div>
                <div className="h-[80px] px-[5px] items-center align-items-center p-[10px]">
                  <input
                    type="range"
                    min={0}
                    value={breakMinutes}
                    onChange={(e) => {
                      setBreakMinutes(e.target.value);
                      mode === "break" && setSecondsLeft(e.target.value * 60);
                      localStorage.setItem(
                        `${key}breakMinutes`,
                        e.target.value
                      );
                    }}
                    max={120}
                    // step={5}
                    className="range range-error range-sm"
                    height={"10px"}
                  />
                  <span className="prose text-xs">
                    Break :{" "}
                    <span className="text-error prose-lg ">
                      {breakMinutes} min
                    </span>{" "}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <audio id="audio_tag" src={timerEnd} />

      {isPaused && (
        <div className="flex flex-row gap-[10px] text-bold self-center mb-[20px] rotate-360">
          <span className="text-xs self-center text-cente font-semibold">
            Work
          </span>
          <input
            type="checkbox"
            className="toggle toggle-xs"
            checked={toggle}
            onChange={onToggle}
          />
          <span className="text-xs self-center text-center font-semibold">
            Break
          </span>
        </div>
      )}
      {disabled && (
        <span className="text-xs italic text-warning">
          please rate the session and stop the countdown/stopwatch
        </span>
      )}
    </div>
  );
}
