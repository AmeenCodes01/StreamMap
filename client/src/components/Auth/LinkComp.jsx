import {Link} from "react-router-dom";
import React from "react";

function LinkComp({label}) {
  return (
    <>
      <Link
        to={label == "login" ? "/signup" : "/login"}
        className="link link-infp text-xs mt-[50px] self-end mr-[5px]"
      >
        {label === "login" ? "Don't" : "Already"} have an account ?{" "}
        {label === "login" ? "Sign Up" : "Login"}
      </Link>
    </>
  );
}

export default LinkComp;
