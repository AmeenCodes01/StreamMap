import {useState} from "react";
import toast from "react-hot-toast";
import {useAuthContext} from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthContext();

  const signup = async ({name, email, timeZone, country, color, profilePic}) => {
    const success = handleInputErrors({
      name,
      email,
      timeZone,
      country,
      color,
      profilePic,
    });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, timeZone, country, color, profilePic}),
      });

      const data = await res.json();
      console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("auth-user", JSON.stringify(data));
      setAuthUser(data);
      console.log(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {loading, signup};
};
export default useSignup;

function handleInputErrors({name, email, timeZone, country, color, profilePic}) {
  if (!country) {
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
}
