import {useState} from "react";
import toast from "react-hot-toast";
import useAuthId from "./useAuthId";

const usePromise = () => {
  const [loading, setLoading] = useState(false);
  const {authId} = useAuthId();

  const getPromises = async () => {
    setLoading(true);
    console.log(authId, "auth Id");
    try {
      const res = await fetch(
        "https://streammap.onrender.com/api/promise/get",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({id: authId}),
        }
      );

      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        throw new Error(data.error);
      }
      setLoading(false);
      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const newPromise = async (promise, coins) => {
    console.log(promise, coins, "uuu");
    try {
      const res = await fetch(
        "https://streammap.onrender.com/api/promise/new",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({id: authId, promise, coins}),
        }
      );

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
      const res = await fetch(
        "https://streammap.onrender.com/api/promise/edit",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({id, promise}),
        }
      );

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
    console.log("DELid", id);
    try {
      const res = await fetch(
        "https://streammap.onrender.com/api/promise/delete",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({id}),
        }
      );
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
      const res = await fetch(
        "https://streammap.onrender.com/api/promise/update",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({id, coins, authId}),
        }
      );

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
  const getTotalDonations = async () => {
    setLoading(true);
    console.log("E");
    try {
      const res = await fetch(
        "https://streammap.onrender.com/api/promise/total",
        {
          method: "GET",
          // headers: {"Content-Type": "application/json"},
          // body: JSON.stringify({id, coins}),
        }
      );

      const data = await res.json();
      console.log(data);
      if (data.error) {
        console.log(data.error);
        throw new Error(data.error);
      }
      console.log(data, "upadtedPromise");
      setLoading(false);
      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  return {
    getPromises,
    newPromise,
    deletePromise,
    updatePromise,
    editPromise,
    getTotalDonations,
    loading,
  };
};

export default usePromise;
