// SleepTracker.js

import React, { useState } from 'react';
import { BiSolidUpArrow,BiSolidDownArrow  } from "react-icons/bi";

const SleepTracker = () => {
  const [hoursSlept, setHoursSlept] = useState('');

  const handleSubmit = () => {
    // Here you can handle submitting the sleep data
    // You can also add further logic such as sending the data to a server or storing it locally
  };

  
  const handleHoursChange = (e) => {
    const inputValue = e.target.value;
    // Use a regular expression to match only digits
    if (/^\d*\.?\d*$/.test(inputValue)) {
      // Update the state if the input is a valid number
      setHoursSlept(e.target.value);
    }
  };

  return (
    <div className="  items-center  max-w-[100%] ">
      <div className='border-2 z-[0] border-dashed border-base-content p-[10px] '>

    <h2 className="text-xl font-semibold mb-4">Sleep Tracker</h2>
    <div className='flex flex-row '>
      <BiSolidUpArrow size={10} className='self-center mr-[5px]' onClick={()=> setHoursSlept(hoursSlept +1)} />
      <span className='self-center'>[</span>
      <input type="" min={1}  className=" self-center input  input-xs w-[70px] placeholder:italic placeholder:text-xs  text-center items-center"  placeholder="sleep hrs"
        value={hoursSlept}
        onChange={handleHoursChange} />
      <span className='self-center'>]</span>
      <BiSolidDownArrow size={10} className='self-center ml-[5px]' onClick={()=> hoursSlept >1 ? setHoursSlept(hoursSlept -1): null} />
    </div>
    <button
      onClick={handleSubmit}
      className="btn btn-xs btn-warning text-center self-center ml-[auto] mr-[auto] justify-center flex pb-[10px] mt-[10px]"
    >
      Submit
    </button>
      </div>
  </div>
  
  );
};

export default SleepTracker;
