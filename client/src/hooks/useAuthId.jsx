import { useAuthContext } from "../context/AuthContext";
import { Route, useParams } from "react-router-dom";



const useAuthId = () =>{
    const {id:room} = useParams()
    const {authUser } = useAuthContext()
    const key = `${authUser._id}${room}`
    const authId = authUser._id
    return {authId, key, room}
}

export default useAuthId