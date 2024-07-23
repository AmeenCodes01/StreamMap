import React, {useState} from "react";
import GoogleLogin from "../components/GoogleLogin";
import useLogin from "../hooks/useLogin";
import LinkComp from "../components/Auth/LinkComp";
import AuthForm from "../components/Auth/AuthForm";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import DonationInfo from "../components/Auth/DonationInfo";

function Login() {
  const [login, setLogin] = useState(null);
  const [profile, setProfile] = useState();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [localAuth, setLocalAuth] = useState(false);
  const navigate = useNavigate();
  const {loading, login: logging, checkUser} = useLogin();
  
  if (loading) {
    return (
      <div className="flex  self-center justify-self-center justify-center h-[100vh]">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  const onLocalLogin = async () => {
    if (name !== "" && pass.length > 3) {
      const tryLogin = await logging({name, pass});

      if (tryLogin) navigate("/", {replace: true});
    } else {
      toast.error("Please enter the correct details.");
    }
  };

  return (
    <div className="w-[100%] h-[100vh]  overflow-auto flex p-[5px]  relative sm:flex-row flex-col mb-[100px] sm:mb-0 ">
      <div className="flex  w-[100%] sm:w-[50%]  h-[100%] ">
        <img className="" src="/Banner.png" alt="Banner" />{" "}
      </div>
      <div className="flex  flex-col justify-self-center sm:w-[50%] p-[50px] w-[100%] self-center items-center  mb-[100px]  ">
        <h1 className="text-center mb-[100px]  ">StreamMap</h1>
        {!localAuth && (
          <GoogleLogin
            setProfile={setProfile}
            setStatus={setLogin}
            label="login"
            login={logging}
            checkUser={checkUser}
          />
        )}

        {login === "fail" ? (
          <p className="text-center">Please try again </p>
        ) : null}
        {localAuth && (
          <>
            <AuthForm
              label={"login"}
              name={name}
              setName={setName}
              pass={pass}
              setPass={setPass}
              showPass={true}
            />
            <button
              className="btn btn-success rounded-none px-16  w-[100%] mt-[25px]    "
              onClick={onLocalLogin}
            >
              Login
            </button>
          </>
        )}

        {!localAuth && (
          <button
            onClick={() => setLocalAuth(true)}
            className="btn btn-success rounded-none px-16  w-[100%] mt-[25px]    "
          >
            Login
          </button>
        )}
        <LinkComp label="login" />
        {/* <div className="s flex items-end justify-end justify-self-end mt-[auto]    ">
          <DonationInfo />
        </div> */}
      </div>
    </div>
  );
}

export default Login;
