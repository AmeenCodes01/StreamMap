import React from "react";
import usePomodoro from "../../hooks/usePomodoro";
import {MdDeleteForever} from "react-icons/md";

function DeleteButton({setShowRating}) {
  const {reset} = usePomodoro();
  return (
    <button
      className="btn btn-error my-[10px] h-[30px] w-[150px]"
      onClick={() => {
        console.log("button clicked");
        reset("delete");
        setShowRating(false);
      }}
      type="button"
    >
      <MdDeleteForever size={25} />
      session
    </button>
  );
}

export default DeleteButton;
