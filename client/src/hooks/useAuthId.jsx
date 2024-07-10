import { useAuthContext } from "../context/AuthContext";
import { Route, useParams } from "react-router-dom";



const useAuthId = () =>{
    const {id:room} = useParams()
    const {authUser } = useAuthContext()
    const key = `${authUser._id}${room}`
    const authId = authUser._id
    const name = authUser.name
    return {authId, key, room,name}
}

export default useAuthId