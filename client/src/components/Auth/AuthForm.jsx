import React, {useState} from "react";

function AuthForm({label, name, setName, pass, setPass, showPass}) {
  return (
    <div>
      <h1 className="self-center items-center text-center mb-[50px]">
        {label == "login" ? "Login" : "Sign Up"}
      </h1>

      <div className="flex space-between justify-self-start items-center flex-col ">
        <input
          placeholder={label === "localSignUp" ? "display name" : "name"}
          className="border-1 input-sm rounded-[6px] mb-[20px]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {showPass && (
          <div className="flex flex-col">
            <input
              placeholder="password"
              className="border-1 input-sm rounded-[6px]"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <span>must be atleast 4 characters long</span>
          </div>
        )}
        {/* button DONE.  */}
      </div>
    </div>
  );
}

export default AuthForm;
