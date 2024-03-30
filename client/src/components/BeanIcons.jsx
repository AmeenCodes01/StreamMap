import {useState} from 'react'
import { BiSolidCoffeeBean } from "react-icons/bi";




const BeanIcons = ({ color, text,setMood, setMoodColor }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  const handleSelect = ()=> {
    console.log(text,color)
    setMood(text)
    setMoodColor(`${color}`)
  }
    return (
      <div 
        className="tooltip-container relative "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleSelect}
      >
        {isHovered && <span  className="tooltip-text absolute bg-[#d29272] top-[-30px]   text-xs tracking-wide rounded-lg px-[5px] py-[2px] z-[1000] text-base-100 rotate-90 "
        style={{
            left: color ==="#be7261" ? "-13px": 0
        }}
        >{text}</span>}
              <BiSolidCoffeeBean color={color}  title='seee'  className="size-5   transition ease-in-out delay-15  duration-500 hover:translate-y-3 "  />

      </div>
    );
  };

export default BeanIcons