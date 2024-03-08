import React, {useState, useEffect} from "react";
import {googleLogout, useGoogleLogin, GoogleLogin} from "@react-oauth/google";
import axios from "axios";
import Select from "react-select";
import {useAuthContext} from "../context/AuthContext";

function LoginModal({
  countNames,
  setMyCountry,
  primColor,
  setColor,
  onJoin,
  setJoin,
  showJoin,
  profile,
  setProfile,
  setModalOpen,
}) {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {headers: {Authorization: `Bearer ${tokenResponse.access_token}`}}
      );

      setProfile([userInfo.data]);
      try {
        const res = await fetch("/api/auth/check", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: userInfo.data.email}),
        });
        const data = await res.json();
        console.log(data.exist);
        // if (data.error) {
        //   throw new Error(data.error);
        // }
        if (data.exist) {
          console.log("hi");
          setAuthUser(data.user);
          localStorage.setItem("auth-user", JSON.stringify(data.user));

          setModalOpen(false);
        }
      } catch (e) {
        console.log(e);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div className="text-white p-[8px]   max-h-[200px] min-h-[150px]       ">
      <div
        className="items-center justify-center flex overflow-hidden"
        style={{
          height: profile.length == 0 ? "100px" : "0px",
          // transition: "height 1s",
        }}>
        <GoogleLogin
          onSuccess={googleLogin}
          text="signin_with"
          theme="filled_blue"
          shape="square"
          size="large"
          use_fedcm_for_prompt={true}
          logo_alignment="center"
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
      {profile.length !== 0 ? (
        <div className="flex flex-row-reverse justify-center pt-[5px] ">
          <h1 className="text-center text-[22px] self-center ml-[10px]">
            Hello {profile[0].name} !
          </h1>
          <img
            src={`${profile[0].picture}`}
            className=" w-[50px] h-[50px] rounded-[100px]"
          />
        </div>
      ) : null}
      <div
        className="items-center flex pt-[10px] flex-col  "
        style={{
          height: profile.length == 0 ? "0px" : "100px",
          transition: "height 1.5s",
          overflow: profile.length == 0 ? "hidden" : "visible",
        }}>
        <div
          className=" "
          style={{
            display: showJoin ? "flex" : " none",
          }}>
          <Select
            className="basic-single"
            classNamePrefix="select"
            defaultValue={null}
            classNames={{
              input: () =>
                `  text-start w-[200px]  text-white z-[1000] flex
          absolute
          `,
              placeholder: () => `text-start  text-white `,
              singleValue: () => ` text-start  text-white  `,

              container: () => " border-[4px]  flex  w-[100%] rounded-[6px] ",
              control: () =>
                "  flex text-center min-w-[150px]  relative  rounded-[6px] h-[30px] self-center  ",
              valueContainer: () => " mx-[4px] my-[2px]   ",
              indicatorsContainer: () => "  rounded-r-[6px] mr-[8px]",
              indicatorSeparator: () => "  ",
              menu: () =>
                "   w-[100%] flex flex-col z-[1000] absolute bg-[#b2d2de]  max-h-[150px] mt-[50px]",
              option: ({isFocused}) =>
                ` ${
                  isFocused ? "bg-purple-60 " : "bg-blue"
                }  linear-gradient(to bottom, #CAF0F8, rgb(116, 192, 219))    my-[10px] p-[5px]  text-white `,
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
            options={countNames}
          />
          <div className="flex   pl-[10px]   ">
            {/* <p className="text-white self-center">color:</p> */}
            <label
              className=" rounded-[6px] "
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
        <div
          onClick={() => {
            onJoin();
            if (!showJoin) {
              setJoin(true);
            } else {
              onJoin();
            }
          }}
          className="border-[1px] rounded-[6px] text-[black] flex bg-[white] self-end px-[10px] m-[5px]  ">
          <span>Join</span>
          {/* <p className={styles.tw}> */}
          {/* {countries.length > 0 ? "Change" : "Join"} */}
          {/* </p> */}
        </div>
      </div>
    </div>
  );
}
export default LoginModal;
