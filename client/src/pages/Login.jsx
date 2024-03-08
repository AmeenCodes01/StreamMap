import React, {useState} from "react";
import {Toaster} from "react-hot-toast";

import GoogleLogin from "../components/GoogleLogin";
import useLogin from "../hooks/useLogin";

function Login() {
  const [login, setLogin] = useState(null);
  const [profile, setProfile] = useState();
  const {loading, login: logging} = useLogin();
  if (loading) {
    return (
      <div className="flex self-center justify-self-center justify-center h-[100vh]">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="w-[100%] h-[100vh]    overflow-auto flex justify-center  relative">
      <div className="flex self-center flex-col justify-self-center  w-[300px] h-[500px] md:h-[700px] border-[1px]  ">
        <h1 className="text-center mb-[100px] ">StreamMap</h1>
        <GoogleLogin
          setProfile={setProfile}
          setStatus={setLogin}
          label="login"
          login={logging}
        />
        {login === "fail" ? (
          <p className="text-center">Please try again </p>
        ) : null}
      </div>
      {/* <Toaster /> */}
    </div>
  );
}

export default Login;
