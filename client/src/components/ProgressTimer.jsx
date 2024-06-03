import React from 'react'

  const ProgressTimer = ({timeLeft, progress})=>(
    <div className="flex ">
      <div className="self-center flex-row  mr-auto flex gap-[10px] ">
        {/* <button className=" btn btn-sm bg-accent" onClick={toggleTimer}>
          {isActive ? "Pause" : "Start"}
        </button>
        <button className=" btn btn-sm bg-neutral" onClick={resetTimer}>
          Reset
        </button> */}
      </div>
      <div className="flex flex-col">
        <div style={{ position: 'relative',  borderRadius: '4px' }} className="border-4 bg-base border-secondary min-w-[200px] min-h-[40px] flex">
          <div 
          // className={ isBreak ? "bg-error":  "bg-success"}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${progress}%`,
              height: '100%',
              transition: 'width 0.5s ease-in-out' 
              
            }}
          />
          <div style={{ position: 'absolute', zIndex: 1000, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} className=" text-xs  justify-center  gap-[10px] flex flex-row w-[100%] ">
            <p className="">

            {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}            </p>
            <p>Finish Chapter 6 </p>
          </div>
        </div>
        {/* <h2 className="text-center self-end badge-xs py-[10px] my-[10px]  ml-auto badge badge-warning  ">
          {isBreak ? "Break" : "Work"}
        </h2> */}
      </div>
    </div>
  )

export default ProgressTimer