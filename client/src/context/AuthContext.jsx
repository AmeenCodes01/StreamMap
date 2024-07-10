import {createContext, useContext, useState, useMemo} from "react";
export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({children}) => {
  const [authUser, setAuthUser] = useState(() => {
    // This function will only run once on initial render
    const storedUser = localStorage.getItem("auth-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [room, setRoom] = useState();
  const contextValue = useMemo(() => ({
    authUser,
    setAuthUser,
    room,
    setRoom
  }), [authUser, room]);
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
