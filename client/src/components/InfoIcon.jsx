import {useState} from 'react'
import { CiSquareInfo } from "react-icons/ci";

function InfoIcon({info}) {
    const [visible, setVisible] = useState(false)
  return (
    <div className='relative  '>
            <CiSquareInfo onClick={()=> setVisible(!visible) } size={30}/>
            <div className={` ${visible ? "visible":"hidden"}    absolute z-[20] bg-accent text-accent-content border-1 border-white rounded-[8px] p-[3px] min-w-[140px] max-w-[160px]`}>

<span className='text-sm text-white'>
    
    {info}
    </span>
            </div>
        
    </div>
  )
}

export default InfoIcon