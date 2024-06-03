import React, {useState, useEffect} from "react";
import MyMap from "./pages/MyMap";
import Rooms from "./pages/Rooms";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login";
import {useAuthContext} from "./context/AuthContext";
import {Toaster} from "react-hot-toast";
import User from "./pages/User.jsx";
import LeaderBoard from "./pages/LeaderBoards/LeaderBoard.jsx";
import AllUsers from "./pages/AllUsers.jsx";

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




  return (
    <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={authUser ? <Rooms /> : <Navigate to="/login" />}
        exact
      />
      <Route
        path="/signup"
        element={authUser ? <Navigate to="/" /> : <SignUp />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/:id" element={authUser ? <MyMap /> : <Login />} >
  {/* Wrap only User and LeaderBoard components with LeaderBoardContextProvider */}
  <Route path="user" element={<User />} />
  <Route path="leaderboard" element={<LeaderBoard />} />
  {/* AllUsers component is not wrapped with LeaderBoardContextProvider */}
  <Route path="allUsers" element={<AllUsers />} />
</Route>

    </Routes>
    <Toaster />
  </BrowserRouter>
  
  );
}

export default App;
