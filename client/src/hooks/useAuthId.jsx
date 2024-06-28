import { useAuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
const useAuthId = () =>{
    const {id:room} = useParams()
    const {authUser } = useAuthContext()
    const key = `${authUser._id}${room}`
    return authUser._id, key
}

export default useAuthId