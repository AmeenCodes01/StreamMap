import {useState} from "react";
import toast from "react-hot-toast";
import {useAuthContext} from "../context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthContext();
  const API_URL = import.meta.env.VITE_API_URL;
  const login = async (email) => {
    // const success = handleInputErrors(username, password);
    // if (!success) return;
    // setLoading(true);

    try {
      const res = await fetch("https://streammap.onrender.com/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email}),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // localStorage.setItem("token", JSON.stringify(data.token))
      localStorage.setItem("auth-user", JSON.stringify(data));
      setAuthUser(data);
      return data._id;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {loading, login};
};
export default useLogin;

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
}
