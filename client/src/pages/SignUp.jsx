import React, {useState, useEffect} from "react";
import {countryNames} from "../data/countryNames";
import Select from "react-select";
import useSignup from "../hooks/useSignUp";
import {useNavigate} from "react-router-dom";
import GoogleLogin from "../components/GoogleLogin";
import AuthForm from "../components/Auth/AuthForm";
import LinkComp from "../components/Auth/LinkComp";
import toast from "react-hot-toast";
import DonationInfo from "../components/Auth/DonationInfo";

function SignUp() {
  const navigate = useNavigate();
  const [primColor, setColor] = useState("#4361ee");
  const [showColour, setShowColor] = useState(false);
  const [myCountry, setMyCountry] = useState();
  const [signUp, setsignup] = useState(null);
  const [profile, setProfile] = useState("");
  const [localAuth, setLocalAuth] = useState(false);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const {loading, signup, check, addCountry} = useSignup();
  console.log(showColour, "showColor", myCountry);

  const onSignIn = async () => {
    console.log(myCountry, "country");

    if ((myCountry && profile) || (myCountry && name && pass)) {
      let data;
      const userInfo = {
        name: localAuth ? name : profile.given_name,
        profilePic: localAuth ? null : profile.picture,
        email: localAuth ? null : profile.email,
        country: myCountry,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        password: localAuth && pass,
        displayName: localAuth ? null : name,
      };
      if (localAuth) {
        if (name && pass) {
          addCountry(myCountry, primColor);
          data = await signup(userInfo);
        } else {
          return toast.error("Please fill in the fields");
        }
      } else {
        showColour ? addCountry(myCountry, primColor) : null;
        data = await signup(userInfo);
      }

      if (data) {
        console.log(data, "data");
        navigate("/");
      }
    } else {
      console.log("render", myCountry, profile, name, pass);
      return toast.error("Please fill in the fields");
    }
  };
  //after taking country input, check if it country & its colour already exist by making a call to checkCountry.
  useEffect(() => {
    const checkCountry = async () => {
      if (myCountry !== undefined) {
        const exist = await check(myCountry);
        exist == false ? setShowColor(true) : setShowColor(false);
        console.log(exist, "exist");
      } else {
        setShowColor(false);
      }
    };
    checkCountry();
  }, [myCountry]);

  useEffect(() => {
    if (!localAuth && profile) {
      setName(profile.given_name);
    } else {
      setName("");
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex self-center justify-self-center justify-center h-[100vh]">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-[100%] h-[100vh]  overflow-auto flex p-[5px]  relative sm:flex-row flex-col mb-[100px] sm:mb-0 space-between gap-[5px] ">
      <div className="flex   w-[100%] sm:w-[50%] h-[100%] ">
        <img className="" src="/Banner.png" alt="Banner" />{" "}
      </div>

      <div className="flex  flex-col justify-self-center sm:w-[50%] p-[50px] w-[100%] self-center items-center  mb-[100px] sm:mb-[30px] border-1 space-between gap-[15px]  ">
        <div>
          <h1 className="text-center ">StreamMap</h1>
          {!profile ? (
            <div className=" mt-[100px] sm:mt-[50px]  justify-center flex flex-col">
              {!localAuth && (
                <GoogleLogin setProfile={setProfile} setStatus={setsignup} />
              )}
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
          {signUp === "exist" ? (
            <div className="mt-[50px] ">
              <GoogleLogin
                setProfile={setProfile}
                setStatus={setsignup}
                status={signUp}
              />
              {/* {toast.error("User already exists")} */}
            </div>
          ) : null}

          {(profile && signUp !== "exist") || localAuth ? (
            <>
              <AuthForm
                label={localAuth ? "signup" : "localSignUp"}
                name={name}
                setName={setName}
                pass={pass}
                setPass={setPass}
                showPass={localAuth}
              />
              <div
                className=" mt-[10px] flex flex-col mx-[10px]  "
                style={
                  {
                    //    display: signUp === "success" ? "flex" : " none",
                    //    height: signUp === "success" ? "60px" : "0px",
                    //     transition: "height 1s",
                    //      transitionDelay: "2s",
                  }
                }
              >
                <label className="input input-bordered flex items-center gap-2 mt-[20px]">
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

                      container: () => "   flex  w-[100%] rounded-[6px] ",
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
                </label>
                <span className="text-sm italic mt-[2px]">
                  If you wish to keep country & time hidden, choose Antartica.{" "}
                </span>
                {showColour ? (
                  <div className="flex pl-[10px]  mt-[10px] space-between justify-between ">
                    <p className=" self-center">your favourite color:</p>
                    <label
                      className=" rounded-[6px] ml-[10px] self-end "
                      style={{backgroundColor: primColor, borderWidth: "0px"}}
                    >
                      <input
                        type="color"
                        value={primColor}
                        className="w-[50px] h-[50px]  border-[0px] self-center  block opacity-0"
                        style={{backgroundColor: primColor, borderWidth: "0px"}}
                        onChange={(e) => setColor(e.target.value)}
                      />
                    </label>
                  </div>
                ) : (
                  myCountry == !undefined && (
                    <p>someone from your country is already here :)</p>
                  )
                )}
              </div>

              <div className=" flex   mt-[20px] justify-items-center justify-center align-bottom ">
                <button
                  onClick={() => {
                    onSignIn();
                  }}
                  className="btn btn-success rounded-[6px] px-16  w-[100%] mt-[25px]   "
                >
                  Join
                </button>
              </div>
            </>
          ) : null}

          {!localAuth && profile === "" ? (
            <button
              onClick={() => setLocalAuth(true)}
              className="btn btn-success rounded-none px-16  w-[100%] mt-[25px]   "
            >
              Sign Up
            </button>
          ) : null}
        </div>

        <LinkComp label="signup" onClick={() => setLocalAuth(true)} />
        {/* 
        <div className="s flex items-end justify-end justify-self-end mb-[auto]    ">
          <DonationInfo />
        </div> */}
      </div>
    </div>
  );
}

export default SignUp;
