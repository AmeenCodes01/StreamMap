import {createContext, useContext, useState, useEffect} from "react";
export const TimeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTimeContext = () => {
  return useContext(TimeContext);
};



export const TimeContextProvider = ({children}) => {
  //in session timers
  const pausedTime = localStorage.getItem("PausedTime")

  const elapsedTime = (Date.now() - localStorage.getItem("startTime")) / 1000;
  
  const [inSesh, setInSesh] = useState([])
  const [seshInfo, setSeshInfo] = useState([]);
  const [seshGoal, setSeshGoal] = useState("");
  const [allSessions,setAllSessions] = useState([])
  const [workMinutes, setWorkMinutes] = useState(
    parseInt( localStorage.getItem("workMinutes")) ||60
    ); 
    const [breakMinutes, setBreakMinutes] = useState(
    parseInt(localStorage.getItem("breakMinutes")) || 10
  );
    const [isPaused, setIsPaused] = useState(
     ( localStorage.getItem("isPaused") === "true" ? true : false)
      )
  
  
   
    const [showRating, setShowRating] = useState(false)
    
    const [mode, setMode] = useState(localStorage.getItem("mode") || "work");
    
    const [isRunning, setIsRunning] = useState(  
      localStorage.getItem("isRunning") === "true" || false
    );
    const remainingTime =  ((mode === "work" ? workMinutes : breakMinutes) * 60)
    - elapsedTime;
        
    const intialTime = Number(localStorage.getItem("time") || (mode === "work" ? workMinutes * 60 : breakMinutes * 60) )
  
  
    const [secondsLeft, setSecondsLeft] = useState(intialTime)  
  
  useEffect(() => {
      localStorage.setItem("isPaused", isPaused);
    }, [isPaused]);
    
    useEffect(() => {
      localStorage.setItem("mode", mode);
    }, [mode]);
    
    useEffect(() => {
      localStorage.setItem("isRunning", isRunning);
    }, [isRunning]);
    
    useEffect(() => {
      localStorage.setItem("workMinutes", workMinutes);
    }, [workMinutes]);
    
  
  
  
    return (
    <TimeContext.Provider value={{allSessions,setAllSessions,seshGoal, setSeshGoal,inSesh,seshInfo, setSeshInfo,
     setInSesh, workMinutes, setWorkMinutes, isPaused, showRating,setShowRating,
      setIsPaused, mode, setMode, isRunning,setIsRunning, secondsLeft, setSecondsLeft, breakMinutes, setBreakMinutes}}>
      {children}
    </TimeContext.Provider>
  );
};
