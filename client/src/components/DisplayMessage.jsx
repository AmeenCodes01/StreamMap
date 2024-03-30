import {useEffect,useState} from 'react'
import { useSocketContext } from "../context/SocketContext";

function DisplayMessage() {
    const { socket } = useSocketContext();
    const [message,setMessage] = useState()
    const [time, setTime] =  useState()


    function convertToTimeZone(hours, minutes, offset) {
      // Convert hours and minutes to milliseconds
      const totalMilliseconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000;
      
      // Convert offset to milliseconds
      const offsetMilliseconds = offset * 60 * 60 * 1000;
      
      // Calculate the new time in milliseconds
      const newTimeMilliseconds = totalMilliseconds + offsetMilliseconds;
      
      // Convert milliseconds to hours and minutes
      const newHours = Math.floor(newTimeMilliseconds / (60 * 60 * 1000));
      const newMinutes = Math.floor((newTimeMilliseconds % (60 * 60 * 1000)) / (60 * 1000));
    
      return { hours: newHours, minutes: newMinutes };
    }
    
   
    console.log(time, message)
    
    
    
    useEffect(()=> {
        console.log("helllo")
        const handler = (e)=>{
          if (e.label ==="time"){
            const localTime = convertToTimeZone(e.hours, e.minutes, e.offset)
          setTime({
            hours: localTime.hours, minutes: localTime.minutes
          })          }
          if (e.label==="message"){
            setMessage(message)
          }
        }
      socket?.on('stream-message', handler)  
    }, [socket, message, time])


  return (
    <div>DisplayMessage</div>
  )
}

export default DisplayMessage