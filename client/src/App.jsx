import React from "react";
import MyMap from "./pages/MyMap";
import Rooms from "./pages/Rooms";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login";
import {useAuthContext} from "./context/AuthContext";
import {Toaster} from "react-hot-toast";

function App() {
  const {authUser} = useAuthContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={authUser ? <Rooms /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        {/* <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} /> */}

        <Route path="/" element={<Rooms />} exact />
        <Route path="/:id" element={<MyMap />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
