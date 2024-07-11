import {useEffect, useState} from "react";
// import toast from "react-hot-toast";
import {useSocketContext} from "../context/SocketContext";
const useGetUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const {onlineUsers} = useSocketContext();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://streammap.onrender.com/api/users/onlineUsers",
          {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ids: onlineUsers}),
          }
        );
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        console.log(data);
        setUsers(data);
      } catch (error) {
        // toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [onlineUsers]);

  return {loading, users};
};
export default useGetUsers;

// get onlineUsers information only.
