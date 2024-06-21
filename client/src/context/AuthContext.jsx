import {createContext, useContext, useState, useEffect} from "react";
export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};






export const AuthContextProvider = ({children}) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("auth-user")) || null
    );
    const [room, setRoom] = useState()
    


  
  
  return (
    <AuthContext.Provider value={{authUser, setAuthUser, room, setRoom}}>
      {children}
    </AuthContext.Provider>
  );
};
