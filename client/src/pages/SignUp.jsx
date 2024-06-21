import React, {useState, useEffect} from "react";
import {countryNames} from "../data/countryNames";
import Select from "react-select";
import useSignup from "../hooks/useSignUp";
import useLogin from "../hooks/useLogin";
import GoogleLogin from "../components/GoogleLogin";
function SignUp() {
  const [primColor, setColor] = useState("#4361ee");

  const [myCountry, setMyCountry] = useState();
  const [signUp, setsignup] = useState(null);
  const [profile, setProfile] = useState();
  const {loading, signup} = useSignup();
  const {login} = useLogin();

  const onSignIn = async () => {
    if (primColor && myCountry) {
      const userInfo = {
        name: profile.given_name,
        profilePic: profile.picture,
        email: profile.email,
        country: myCountry,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        color: primColor,
      };
      signup(userInfo);
    }
  };

  if (loading) {
    return (
      <div className="flex self-center justify-self-center justify-center h-[100vh]">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="w-[100%] h-[100vh]    overflow-auto flex justify-center  relative">
      <div className="flex self-center flex-col justify-self-center  w-[300px] h-[500px] md:h-[700px] border-[1px] ">
        <h1 className="text-center ">StreamMap</h1>
        {!profile ? (
          <div className=" mt-[100px]  justify-center flex flex-col">
            <GoogleLogin setProfile={setProfile} setStatus={setsignup} />
            {signUp === "fail" ? (
              <p className="text-center">Please try again </p>
            ) : null}
            {signUp === "exist" ? (
              <p className="text-center">User already exists </p>
            ) : null}
          </div>
        ) : signUp !== "exist" ? (
          <h2 className="text-center mt-[15px]  ">Hello {profile.name} !</h2>
        ) : null}

        {signUp == "exist" ? (
          <div className="mt-[50px]">
            <GoogleLogin
              setProfile={setProfile}
              setStatus={setsignup}
              status={signUp}
            />
            {/* {toast.error("User already exists")} */}
          </div>
        ) : null}
        {profile && signUp !== "exist" ? (
          <>
            <div
              className=" mt-[50px] flex flex-col mx-[10px]  "
              style={{
                display: signUp === "success" ? "flex" : " none",
                height: signUp === "success" ? "60px" : "0px",
                transition: "height 1s",
                transitionDelay: "2s",
              }}>
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={null}
                classNames={{
                  input: () =>
                    `  text-start w-[100%]   z-[1000] flex
          absolute
          `,
                  placeholder: () => `text-start   `,
                  singleValue: () => ` text-start    `,

                  container: () =>
                    " border-[1px]  flex  w-[100%] rounded-[6px] ",
                  control: () =>
                    "  flex text-center   relative  rounded-[6px] h-[30px] self-center w-[100%] ",
                  valueContainer: () => " mx-[4px] my-[2px]   ",
                  indicatorsContainer: () => "  rounded-r-[6px] mr-[8px]",
                  indicatorSeparator: () => "  ",
                  menu: () =>
                    "   w-[100%] flex flex-col z-[1000] absolute bg-[white]  max-h-[300px] mt-[30px]",
                  option: ({isFocused}) =>
                    ` ${
                      isFocused ? "bg-purple-60 " : "bg-blue"
                    }  linear-gradient(to bottom, #CAF0F8, rgb(116, 192, 219))    my-[10px] p-[5px]   `,
                }}
                styles={{
                  menuList: (base) => ({
                    ...base,

                    "::-webkit-scrollbar": {
                      width: "4px",
                      height: "0px",
                    },
                    "::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                    },
                    "::-webkit-scrollbar-thumb": {
                      background: "#888",
                    },
                    "::-webkit-scrollbar-thumb:hover": {
                      background: "#555",
                    },
                  }),
                  input: (baseStyles) => ({}),
                  placeholder: (base) => ({}),
                  singleValue: (base) => ({}),
                  container: (baseStyles, state) => ({
                    ...baseStyles,
                    width: "100%",
                    // backgroundColor: "#262626",
                  }),
                  control: (baseStyles, state) => ({}),
                  indicatorSeparator: (baseStyles, state) => ({}),
                  menu: (baseStyles, state) => ({}),
                  option: (baseStyles, state) => ({}),
                }}
                placeholder="country name"
                onChange={(e) => setMyCountry(e.value)}
                name="color"
                options={countryNames}
              />
              <div className="flex pl-[10px]  mt-[20px] space-between justify-between ">
                <p className=" self-center">your favourite color:</p>
                <label
                  className=" rounded-[6px] ml-[10px] self-end "
                  style={{backgroundColor: primColor, borderWidth: "0px"}}>
                  <input
                    type="color"
                    value={primColor}
                    className="w-[50px] h-[50px]  border-[0px] self-center  block opacity-0"
                    style={{backgroundColor: primColor, borderWidth: "0px"}}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </label>
              </div>
            </div>
            <div className=" flex   h-[100%] mt-[50px] justify-items-center justify-center align-bottom ">
              <button
                onClick={() => {
                  onSignIn();
                }}
                className="btn btn-success btn-primary rounded-[12px] w-[80%] mt-[auto] mb-[30px] self-center ">
                Join
              </button>
            </div>
          </>
        ) : null}
      </div>
      {/* <Toaster /> */}
    </div>
  );
}

export default SignUp;
