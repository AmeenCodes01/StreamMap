import { useState } from "react";
import Stopwatch from "./StopWatch";
import Countdown from "./CountDown";
import { PiClockCountdownThin } from "react-icons/pi";
import { IoMdStopwatch } from "react-icons/io";

function InSeshTimer() {
  const [mode, setMode] = useState(true);
  console.log(mode)
  return (
    <div className="  flex flex-col ">
        <div className="  flex flex-row gap-[10px]">

<span className="text-xs self-center text-center ">Timer</span>
<input type="checkbox"  className="toggle bg-secondary toggle-xs  " onChange={()=> setMode(!mode)} />
        <span className="text-xs self-center text-center ">Countdown</span>
        </div>
     { mode ? <Stopwatch />:
      <Countdown />}

    </div>
  );
}

export default InSeshTimer;
