import React from 'react'
import { SessionTable } from './SessionTable'
import { useStore } from "zustand";

function UserSessions() {
    const {seshInfo} = useStore(state => ({
      seshInfo: state.seshInfo, 
    }))
  return (
    <div className="h-[90%] flex w-[86%] mr-[auto] ml-[auto] justify-center self-center ">
          <SessionTable arr={seshInfo} />
        </div>
  )
}

export default UserSessions