import React, {useState} from "react";

function AuthForm({label, name, setName, pass, setPass, showPass}) {
  return (
    <div>
      <h1 className="self-center items-center text-center mb-[20px]">
        {label == "login" ? "Login" : "Sign Up"}
      </h1>

      <div className="flex space-between justify-self-start items-center flex-col gap-[10px]  ">
        <label className="input input-bordered flex items-center gap-2">
          <input
            placeholder={label === "localSignUp" ? "display name" : "name"}
            className=""
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        {showPass && (
          <div className="flex flex-col">
            <label className="input input-bordered flex items-center gap-2">
              <input
                placeholder="password"
                className=" "
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </label>
            {label == "signup" && (
              <span className="text-sm italic mt-[2px] text-center">
                must be atleast 4 characters long
              </span>
            )}
          </div>
        )}
        {/* button DONE.  */}
      </div>
    </div>
  );
}

export default AuthForm;
