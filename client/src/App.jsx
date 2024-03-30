import React, {useState, useEffect} from "react";
import MyMap from "./pages/MyMap";
import Rooms from "./pages/Rooms";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login";
import {useAuthContext} from "./context/AuthContext";
import {Toaster} from "react-hot-toast";
import axios from 'axios';

function App() {
  const {authUser} = useAuthContext();
//   const [token, setToken] = useState(document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1]);
// console.log(token)
// useEffect(() => {
//   const checkTokenExpiry = async () => {
//     if (token) {
//       const decodedToken = decodeToken(token);
//       const currentTime = Math.floor(Date.now() / 1000);
//       if (decodedToken.exp < currentTime) {
//         try {
//           const refreshedToken = await refreshToken();
//           setToken(refreshedToken);
//         } catch (error) {
//           console.error('Error refreshing token:', error);
//           // Handle token refresh failure
//         }
//       }
//     }
//   };

//   checkTokenExpiry();
// }, [token]);
useEffect( ()=>{
  const refresh =async ()=>{
  if (authUser){

  try {
    const res = await fetch("/api/refreshToken", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({userId: authUser._id}),
    });
    const data = await res.json();
    console.log(data)
    if (data.error) {
      throw new Error(data.error);
    }
  } catch (error) {
    console.log("error", error)
    // toast.error(error.message);
  } 
  
}
}
refresh()
  
}, [authUser]);

const decodeToken = (token) => {
  return JSON.parse(atob(token.split('.')[1]));
};

const refreshToken = async () => {
  try {
    const response = await axios.post('/api/refreshToken', { token });
    const newToken = response.data.token;
    return newToken;
  } catch (error) {
    throw new Error('Token refresh failed');
  }
};


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={authUser ? <Rooms /> : <Navigate to="/login" />} exact
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/login"
          element={ <Login />}
        />
        {/* authUser ? <Navigate to="/" /> : */}
        {/* <Route path="/signup" element={<SignUp />} />
        // <Route path="/login" element={<Login />} /> */}

        {/* <Route path="/" element={<Rooms />} exact /> */}
        <Route path="/:id" element={ authUser ? <MyMap /> : <Login/>} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
