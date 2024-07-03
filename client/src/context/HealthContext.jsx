import {createContext, useContext, useState, useEffect} from "react";
import useAuthId from "../hooks/useAuthId";
export const HealthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useHealthContext = () => {
  return useContext(HealthContext);
};

export const HealthContextProvider = ({children}) => {
  const {authId} = useAuthId();

  const [mood, setMood] = useState(localStorage.getItem(`${authId}mood`) || "");

  return (
    <HealthContext.Provider value={{mood, setMood}}>
      {children}
    </HealthContext.Provider>
  );
};
