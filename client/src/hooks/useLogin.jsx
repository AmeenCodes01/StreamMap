import {useState} from "react";
import toast from "react-hot-toast";
import {useAuthContext} from "../context/AuthContext";
import {config} from "../config";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthContext();
  const API_URL = import.meta.env.VITE_API_URL;

  const login = async ({name, email, pass}) => {
    // const success = handleInputErrors(username, password);
    // if (!success) return;
    // setLoading(true);
    console.log(pass, "PASSWORD", email);
    try {
      const res = await fetch(`${config.API_URL}/api/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, password: pass}),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      console.log(data, "data");
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

  const checkUser = async (identity) => {
    try {
      const res = await fetch(`${config.API_URL}/api/auth/check`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({identity}),
      }).catch((e) => (e.response ? setStatus("fail") : null));

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      if (data?.exist === "true") {
        toast.error("User exists");
        // navigate("/signup");
        return data.exist;
      }
      return data.exist;
    } catch (error) {
      console.log(error.message);
    }
  };
  return {loading, login, checkUser};
};
export default useLogin;

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
}
