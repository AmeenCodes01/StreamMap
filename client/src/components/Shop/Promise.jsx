import React from "react";
import {CiSquarePlus} from "react-icons/ci";

function Promise({promise, coins, id, setMode, openModal, setCurrentProm}) {
  console.log(id, "id of pro in prom");
  return (
    <>
      <div className="flex bg-accent flex-col h-[300px] w-[200px]  font-serif border-1">
        <div className=" items-center justify-center p-[10px] h-[90%] flex text-md   ">
          <span className="text-center text-accent-content tracking-wide">
            {promise}
          </span>
        </div>
        <div className=" w-[100%] p-[5px] flex  flex-row gap-[10px] items-center justify-between bg-neutral text-white ">
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
    </>
  );
}

export default Promise;
