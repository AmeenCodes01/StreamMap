import React from 'react'
import usePomodoro from '../../hooks/usePomodoro'
import { MdDeleteForever } from "react-icons/md";

function DeleteButton() {
    const {reset}= usePomodoro()
  return (
    <button className="btn btn-error my-[10px] h-[30px]" onClick={()=> reset("delete")}>

    <MdDeleteForever size={25} />session
</button>

  )
}

export default DeleteButton