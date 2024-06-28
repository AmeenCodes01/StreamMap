import {createContext, useContext, useState, useEffect} from "react";
import useAuthId from "../hooks/useAuthId"

export const TimeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTimeContext = () => {
  return useContext(TimeContext);
};



export const TimeContextProvider = ({children}) => {
  //in session timers

  const key = useAuthId()

  
  const pausedTime = localStorage.getItem(`${key}PausedTime`)

  //so when timer is running, isPaused is false. and then it just remains that way throughout & in localStorage.


  const elapsedTime = (Date.now() - localStorage.getItem(`${key}startTime`)) / 1000;

  const [inSesh, setInSesh] = useState([])
  const [seshInfo, setSeshInfo] = useState([]);
  const [seshGoal, setSeshGoal] = useState("");
  const [allSessions,setAllSessions] = useState([])
  const [workMinutes, setWorkMinutes] = useState(
    parseInt( localStorage.getItem(`${key}workMinutes`)) ||60
    ); 
    const [breakMinutes, setBreakMinutes] = useState(
    parseInt(localStorage.getItem(`${key}breakMinutes`)) || 10
  );
    const [isPaused, setIsPaused] = useState(
     ( localStorage.getItem(`${key}isPaused`) === "true" ? true : false)
      )
  
  
   
    const [showRating, setShowRating] = useState(false)
    
    const [mode, setMode] = useState(localStorage.getItem(`${key}mode`) || "work");
    
    const [isRunning, setIsRunning] = useState(  
      localStorage.getItem(`${key}isRunning`) === "true" || false
    );
    const intialTime = Number(localStorage.getItem(`${key}time`) || (mode === "work" ? workMinutes * 60 : breakMinutes * 60) )
    
    const remainingTime =  ((mode === "work" ? workMinutes : breakMinutes) * 60)
    - elapsedTime;
    
    const [secondsLeft, setSecondsLeft] = useState(intialTime)  
  
    useEffect(()=>{
      setSecondsLeft(isPaused ? pausedTime: remainingTime > 0 ? remainingTime : intialTime)
    }, [])
//stopwatch & countdown 
    const [isStopWatchActive, setIsStopWatchActive] = useState(localStorage.getItem(`${key}stopwatchIsActive`) === "true" || false)
    const [isCountDownActive, setIsCountDownActive] = useState(localStorage.getItem(`${key}countdownIsActive`) === "true" || false)



    useEffect(() => {
      localStorage.setItem(`${key}stopwatchIsActive`, isStopWatchActive);
    }, [ isStopWatchActive]);

    useEffect(() => {
      localStorage.setItem(`${key}countdownIsActive`, isCountDownActive);
    }, [isCountDownActive]);



    //big timer

  useEffect(() => {
      localStorage.setItem(`${key}isPaused`, isPaused);
    }, [isPaused]);
    
    useEffect(() => {
      localStorage.setItem(`${key}mode`, mode);
    }, [mode]);
    
    useEffect(() => {
      localStorage.setItem(`${key}isRunning`, isRunning);
    }, [isRunning]);
    
    useEffect(() => {
      localStorage.setItem(`${key}workMinutes`, workMinutes);
    }, [workMinutes]);
    
  
  
  
    return (
    <TimeContext.Provider value={{allSessions,setAllSessions,seshGoal, setSeshGoal,inSesh,seshInfo, setSeshInfo,
     setInSesh, workMinutes, setWorkMinutes, isPaused, showRating,setShowRating,
      setIsPaused, mode, setMode, isRunning,setIsRunning, secondsLeft, setSecondsLeft, breakMinutes, setBreakMinutes, 
      isStopWatchActive, setIsStopWatchActive, isCountDownActive, setIsCountDownActive}}>
      {children}
    </TimeContext.Provider>
  );
};
