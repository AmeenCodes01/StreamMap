import React from 'react'
import { SessionTable } from './SessionTable'
import { useTimeContext } from "../context/TimeContext";

function UserSessions() {
    const {seshInfo} = useTimeContext()
  return (
    <div className="h-[90%] flex w-[86%] mr-[auto] ml-[auto] justify-center self-center ">
          <SessionTable arr={seshInfo} />
        </div>
  )
}

export default UserSessions