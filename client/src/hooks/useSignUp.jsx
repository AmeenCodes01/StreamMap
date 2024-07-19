import {useState} from "react";
import toast from "react-hot-toast";
import {useAuthContext} from "../context/AuthContext";
import {config} from "../config";
const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthContext();

  const signup = async ({
    name,
    email,
    timeZone,
    country,
    profilePic,
    password,
    displayName,
  }) => {
    const success = handleInputErrors({
      name,
      email,
      timeZone,
      country,
      profilePic,
    });
    if (!success) return;

    setLoading(true);

    try {
      const res = await fetch(`${config.API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name,
          email,
          timeZone,
          country,
          profilePic,
          password,
          displayName,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("auth-user", JSON.stringify(data));
      setAuthUser(data);
      console.log(data);
      return data._id;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const check = async (country) => {
    console.log(country, "red");
    try {
      const res = await fetch(`${config.API_URL}/api/country/check`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({country}),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data?.exist;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addCountry = async (country, color) => {
    console.log(country, color, "red");
    try {
      const res = await fetch(`${config.API_URL}/api/country/add`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({country, color}),
      });

      const data = await res.json();
      if (data.error) {
        console.log("data", data);
        throw new Error(data.error);
        console.log(error);
      }
      console.log(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {loading, signup, check, addCountry};
};
export default useSignup;

function handleInputErrors({
  name,
  email,
  timeZone,
  country,
  color,
  profilePic,
}) {
  if (!country) {
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
}
