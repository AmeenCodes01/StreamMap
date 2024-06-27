import {useAuthContext} from "../context/AuthContext";
import toast from "react-hot-toast";

const usePromise = () => {
  const {authUser} = useAuthContext();

  const getPromises = async () => {
    try {
      const res = await fetch("/api/promise/get", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: authUser._id}),
      });

      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        throw new Error(data.error);
      }
      return data._id;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const newPromise = async (promise, coins) => {
    console.log(promise, coins, "uuu");
    try {
      const res = await fetch("/api/promise/new", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: authUser._id, promise, coins}),
      });

      const data = await res.json();

      if (data.error) {
        console.log(data.error);
        throw new Error(data.error);
      }
      console.log(data, "newPromise");
      return data._id;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editPromise = async (id, promise) => {
    try {
      const res = await fetch("/api/promise/edit", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, promise}),
      });

      const data = await res.json();

      if (data.error) {
        console.log(data.error);
        throw new Error(data.error);
      }
      return data._id;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deletePromise = async (id) => {
    try {
      const res = await fetch("/api/promise/delete", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id}),
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        throw new Error(data.error);
      }
      console.log(data, "delPromise");
      return data._id;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updatePromise = async (id, coins) => {
    try {
      const res = await fetch("/api/promise/update", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, coins}),
      });

      const data = await res.json();

      if (data.error) {
        console.log(data.error);
        throw new Error(data.error);
      }
      console.log(data, "upadtedPromise");
      return data._id;
    } catch (error) {
      toast.error(error.message);
    }
  };

  return {getPromises, newPromise, deletePromise, updatePromise, editPromise};
};
export default usePromise;
