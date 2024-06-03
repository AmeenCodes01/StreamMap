import {createContext, useContext, useState, useEffect} from "react";
export const TimeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTimeContext = () => {
  return useContext(TimeContext);
};




export const TimeContextProvider = ({children}) => {
  //in session timers
  const [inSesh, setInSesh] = useState([])
  const [seshInfo, setSeshInfo] = useState([]);
  const [seshGoal, setSeshGoal] = useState("");
  const [allSessions,setAllSessions] = useState([])
  const [workMinutes, setWorkMinutes] = useState(
   parseInt( localStorage.getItem("workMinutes")) ||60
    ); 
    
    const [isPaused, setIsPaused] = useState(
      localStorage.getItem("isPaused") === "true" ? true : false
    )
    const [showRating, setShowRating] = useState(false)
    
    const [mode, setMode] = useState(localStorage.getItem("mode") || "work");
    
    const [isRunning, setIsRunning] = useState(  
      localStorage.getItem("isRunning") === "true" || false
    );
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
    
  
    console.log(mode,"Mode")  
                
    console.log(isRunning,"isRunning")  
  
  
    return (
    <TimeContext.Provider value={{allSessions,setAllSessions,seshGoal, setSeshGoal,inSesh,seshInfo, setSeshInfo,
     setInSesh, workMinutes, setWorkMinutes, isPaused, showRating,setShowRating,
      setIsPaused, mode, setMode, isRunning,setIsRunning}}>
      {children}
    </TimeContext.Provider>
  );
};
