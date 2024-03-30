import React, {useEffect, useState} from 'react'
import {TiTick} from "react-icons/ti";
import { SessionTable } from "./SessionTable";
import {useParams} from "react-router-dom";
import useSaveSession from '../hooks/useSaveSession';
import useGetSessions from '../hooks/useGetSessions';
import useListenSessions from '../hooks/useListenSession';
import { useSocketContext } from '../context/SocketContext';
import { useAuthContext } from '../context/AuthContext';
import useSessionStates from '../hooks/useSessionStates';
function Sessions({mode, isPaused, duration}) {
    const [seshGoal, setSeshGoal] = useState();
    
    const [seshRating, setSeshRating] = useState(100);
    const [seshCount, setSeshCount] = useState(0);
    const {seshInfo, setSeshInfo} = useSessionStates()
    const [visible,setVisible] = useState(true)
    const {id: room} = useParams();
    const {saveSession, loading} = useSaveSession()
    const {userSessions, loading: load} = useGetSessions()
    const {socket} = useSocketContext()
    const {authUser} = useAuthContext()
    // useEffect(() => {
    //   socket?.on("newSession", (newSession) => {
    //     // newMessage.shouldShake = true;
    //     // const sound = new Audio(notificationSound);
    //     // sound.play();
    //           console.log(newSession)
        
    //     if(newSession.userId == authUser._id){
    //       console.log("same")
    //       console.log(seshInfo)
    //     setSeshInfo([...seshInfo,newSession])
    //     }
    //   });
  
    //   return () => socket?.off("newSession");
    // }, [socket, seshInfo, setSeshInfo]);


useEffect(()=> {
  setSeshInfo(userSessions)

}, [userSessions])


const onSession = ()=> {
        const session = {   
        sessionNumber: seshCount,
        rating: seshRating,
        goal: seshGoal,
        duration,
        room ,
      }

    saveSession(session)
    
    setSeshInfo([...seshInfo, session]);
    setVisible(false)
    setSeshGoal()
   
    setSeshCount(seshCount + 1);

      }

useEffect(()=> {
  mode ==="work" ? setVisible(true) : null
}, [mode])

useListenSessions()

if (load || loading){
  return (
    <div className="skeleton w-32 h-32"></div>
    
    )
  }
  
  return (
    <div className='flex w-[100%] items-center  flex-col mt-[20px]'>  
      {/* <ListenSessions seshInfo={seshInfo} setSeshInfo={setSeshInfo} /> */}
     <div className='w-[100%] '>
     <div className='flex flex-col  mb-[20px] items-center justify-items-center  '>
         {visible ? <div className="flex flex-col  w-[100%]  mt-[10px]  ml-[20px]">
        <input
          value={seshGoal}
          style={{
            height:  !isPaused ? "30px" : "0px",
            
            transition: "height 0.5s",
            padding:   !isPaused  ? "5px" : "0px",
            
          }}
          placeholder="your goal for this session"
          className=" text-start h-[full] text-info w-[100%]  self-end mr-[20px] ml-[auto]  focus:outline-none mr-[3px] input  input-info w-full max-w-xs pl-[5px]"
          onChange={(e) => setSeshGoal(e.target.value)}
        />
       
      </div>: null
       }
         {mode ==="break" && visible ? (
        <div className="flex flex-row mt-[10px] ">
          <p className="text-center self-center mr-[5px] text-[14px]">
            rate your session :
          </p>
          <input
            type="text"
            value={seshRating}
            maxLength={3}
            className="input input-bordered text-warning input-warning max-w-xs pl-[5px] w-[50px]  h-[30px] focus:outline-none"
            onChange={(e) => {
              const regex = /^[0-9\b]+$/;
              if (e.target.value === "" || regex.test(e.target.value)) {
                setSeshRating(e.target.value);
              }
            }}
          />
          <p className="text-center flex self-center pl-[5px] "> %</p>

          <TiTick
            size={30}
            className=" self-center ml-[5px] h-[30px]"
            onClick={onSession}
          />
        </div>
      ) : null}  
            <div className="w-[70%] ml-[auto]">
      </div>
      </div>
      <div className='h-[90%] flex w-[86%] mr-[auto] ml-[auto] justify-center self-center '>
        <SessionTable arr={seshInfo} />

      </div>
     </div>
      </div>
  )
}

export default React.memo(Sessions)