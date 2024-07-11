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
import Shop from "./pages/Shop.jsx";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

function App() {
  const {authUser} = useAuthContext();
  console.log(authUser, "authUser");
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={authUser ? <Rooms /> : <Navigate to="/login" />}
            exact
          />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/shop"
            element={authUser ? <Shop /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/:id" element={authUser ? <MyMap /> : <Login />}>
            {/* Wrap only User and LeaderBoard components with LeaderBoardContextProvider */}
            <Route path="" element={<User />} />
            <Route path="leaderboard" element={<LeaderBoard />} />
            {/* AllUsers component is not wrapped with LeaderBoardContextProvider */}
            <Route path="sessions" element={<AllUsers />} />
          </Route>
        </Routes>
        <Toaster
          containerClassName="z-[100000000000000000000]"
          toastOptions={{
            className: "z-[1000000000000000000000000000]",
            style: {
              zIndex: "10000000000000000000000000000",
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
