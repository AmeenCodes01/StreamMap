import { useState, useEffect } from "react";
import Stopwatch from "./StopWatch";
import Countdown from "./CountDown";
function InSeshTimer() {
  const [mode, setMode] = useState(localStorage.getItem("InSeshmode") ? JSON.parse(localStorage.getItem("InSeshmode")) : false  );

 
  useEffect(() => {
    localStorage.setItem('InSeshmode', JSON.stringify(mode));
  }, [mode]);
  return (
    <div className="flex flex-col bg-base-300 rounded-[10px] p-[5px] ">
      <div className="flex flex-row gap-[10px] text-bold self-center mb-[20px]">
        <span className="text-xs self-center text-cente font-semibold">Countdown</span>
        <input
          type="checkbox"
          className="toggle  toggle-xs"
          checked={mode}
          onChange={() => setMode(!mode)}
          />
        <span className="text-xs self-center text-center font-semibold">StopWatch</span>
      </div>
      {mode ? <Stopwatch /> : <Countdown />}
      <span className="text-xs italic text-warning">
      these timers will auto terminate when session ends. 

        </span>       </div>
  );
}

export default React.memo(InSeshTimer)
//when the big timer stops, the small will terminate and be saved. transfer timer to context, hence making Session independent, then 
//
//