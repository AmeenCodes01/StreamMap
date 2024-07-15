import { useAuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const useAuthId = () => {
    const { id: room } = useParams();
    const { authUser } = useAuthContext();

    // Check if authUser exists before accessing its properties
    if (!authUser) {
        return { authId: null, key: null, room, name: null };
    }

    const key = `${authUser._id}${room}`;
    const authId = authUser._id;
    const name = authUser.name;

    return { authId, key, room, name };
};

export default useAuthId;