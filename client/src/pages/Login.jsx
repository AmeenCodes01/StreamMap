import React, {useState} from "react";
import GoogleLogin from "../components/GoogleLogin";
import useLogin from "../hooks/useLogin";
import LinkComp from "../components/Auth/LinkComp";
import AuthForm from "../components/Auth/AuthForm";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
function Login() {
  const [login, setLogin] = useState(null);
  const [profile, setProfile] = useState();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [localAuth, setLocalAuth] = useState(false);
  const navigate = useNavigate();
  const {loading, login: logging, checkUser} = useLogin();
  console.log(
    localStorage.clear(),
    localStorage.getItem("authUser"),
    "authUser"
  );

  if (loading) {
    return (
      <div className="flex self-center justify-self-center justify-center h-[100vh]">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }
  console.log(localStorage.getItem("authUser"), "authUser");
  const onLocalLogin = async () => {
    if (name !== "" && pass.length > 3) {
      const tryLogin = await logging({name, pass});

      if (tryLogin) navigate("/", {replace: true});
    } else {
      toast.error("Please fill in the fields.");
    }
  };

  return (
    <div className="w-[100%] h-[100vh]    overflow-auto flex justify-center  relative">
      <div className="flex self-center flex-col justify-self-center  w-[300px] h-[500px] md:h-[700px] border-[1px]  ">
        <h1 className="text-center mb-[100px] ">StreamMap</h1>
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
              className="btn glass rounded-none px-16  w-[90%]  mt-[25px]   "
              onClick={onLocalLogin}
            >
              Login
            </button>
          </>
        )}

        {!localAuth && (
          <button
            onClick={() => setLocalAuth(true)}
            className="btn glass rounded-none px-16  w-[90%] mt-[25px]    "
          >
            Login
          </button>
        )}
        <LinkComp label="login" />
      </div>
    </div>
  );
}

export default Login;
