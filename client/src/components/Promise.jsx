import React from "react";
import {CiSquarePlus} from "react-icons/ci";

function Promise({promise, coins, id, setMode, openModal, setCurrentProm}) {
  return (
    <div className="inline-block">
      <div className="border-1  items-center text-center p-[10px]  ">
        {promise}
      </div>
      <div className="border-1 w-[100%] p-[5px] flex  flex-row gap-[10px] items-center ">
        {coins}
        <CiSquarePlus
          size={25}
          onClick={() => {
            setMode("update");
            console.log("click");
            setCurrentProm({_id: id, promise: promise, coins: coins});
            openModal();
          }}
        />
      </div>
    </div>
  );
}

export default Promise;
