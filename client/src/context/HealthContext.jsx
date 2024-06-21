import {createContext, useContext, useState, useEffect} from "react";
export const HealthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useHealthContext = () => {
  return useContext(HealthContext);
};


                                       



export const HealthContextProvider = ({children}) => {
    const [mood, setMood] = useState( localStorage.getItem("mood") || "");




    
  
  return (
    <HealthContext.Provider value={{mood, setMood}}>
      {children}
    </HealthContext.Provider>
  );
};
