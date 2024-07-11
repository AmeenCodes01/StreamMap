import React from "react";
import {useGoogleLogin} from "@react-oauth/google";
import axios from "axios";
import {Link, redirect} from "react-router-dom";
import {useNavigate} from "react-router-dom";

import toast from "react-hot-toast";
function GoogleLogin({setProfile, setStatus, label, status, login}) {
  const navigate = useNavigate();

  const googleAuthLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {Authorization: `Bearer ${tokenResponse.access_token}`},
        })
        .catch((e) => (e.response ? setStatus("fail") : null));
      if (userInfo.data) {
        setProfile(userInfo.data);

        const email = userInfo.data.email;

        if (label === "login") {
          const userLog = await login(email);
          if (userLog) {
            navigate("/");
          }
        } else {
          try {
            const res = await fetch(
              "https://streammap.onrender.com/api/auth/check",
              {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
              }
            ).catch((e) => (e.response ? setStatus("fail") : null));

            const data = await res.json();
            if (data.error) {
              throw new Error(data.error);
            }

            if (data?.exist === "true") {
              setStatus("exist");
              toast.error("User exists");
              navigate("/signup");
            } else {
              setStatus("success");
            }
          } catch (error) {
            console.log(error.message);
          }
        }
      } else {
        setStatus("fail");
      }
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
      setStatus("fail");
    },
  });
  return (
    <div className=" flex flex-col">
      <button
        className="btn glass rounded-none px-16  w-[90%]    "
        onClick={() => googleAuthLogin()}
      >
        {label === "login" ? "Login with Google" : "Sign Up with Google"}
      </button>

      <Link
        to={label == "login" ? "/signup" : "/login"}
        className="link link-infp text-xs mt-[50px] self-end mr-[5px]"
      >
        {label === "login" ? "Don't" : "Already"} have an account ?{" "}
        {label === "login" ? "Sign Up" : "Login"}
      </Link>
    </div>
  );
}

export default GoogleLogin;
