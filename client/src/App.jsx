import React, {useState, useEffect} from "react";
import MyMap from "./pages/MyMap";
import Rooms from "./pages/Rooms";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login";
import {Toaster} from "react-hot-toast";
import User from "./pages/User.jsx";
import LeaderBoard from "./pages/LeaderBoards/LeaderBoard.jsx";
import AllUsers from "./pages/AllUsers.jsx";
import Shop from "./pages/Shop.jsx";
import {QueryClient, QueryClientProvider} from "react-query";
import RedirectOnRefresh from "./RedirectOnRefresh.jsx";
import useAuthId from "./hooks/useAuthId.jsx";
import NetworkNotifier from "./components/NetworkNotifier.jsx";

function App() {
  const {authId} = useAuthId();
  console.log(authId, "authUser");
  return (
    
    <BrowserRouter>
        <RedirectOnRefresh>
    <NetworkNotifier />

          <Routes>
            <Route
              path="/"
              element={authId ? <Rooms /> : <Navigate to="/login" />}
              exact
            />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/shop"
              element={authId ? <Shop /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/:id" element={authId ? <MyMap /> : <Login />}>
              <Route index element={<User />} />
              <Route path="leaderboard" element={<LeaderBoard />} />
              <Route path="sessions" element={<AllUsers />} />
            </Route>
          </Routes>
        </RedirectOnRefresh>
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
  );
}

export default App;
