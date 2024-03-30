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
    
    // useEffect(async() => {
    //   // Check if the user is authenticated
    //   const token = getCookie('jwt');
    //   const getCookie = (name) => {
    //     const value = `; ${document.cookie}`;
    //     const parts = value.split(`; ${name}=`);
    //     if (parts.length === 2) return parts.pop().split(';').shift();
    //   };


      
    //   if (!token) {

    //     await refreshToken(); // Assuming refreshToken is an asynchronous function

    //     // Token expired or not found, handle accordingly (e.g., redirect to login page)
    //     try {
         
    //     } catch (error) {
    //       if (error.response && error.response.status === 401) {
         
    //         await refreshToken(); // Assuming refreshToken is an asynchronous function
         
    //       } else {
         
    //       }
    //     }
    //     return;
    //   }
  
            


    //   // setIsAuthenticated(!!token); // Update authentication state based on token presence
    // }, []);

    

  console.log(authUser)
  
  
  return (
    <AuthContext.Provider value={{authUser, setAuthUser}}>
      {children}
    </AuthContext.Provider>
  );
};
