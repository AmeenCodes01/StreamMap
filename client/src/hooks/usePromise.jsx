import {useState} from "react";
import toast from "react-hot-toast";
import useAuthId from "./useAuthId";
import {config} from "../config";
import { useNetworkStatus } from './useNetworkStatus';

const usePromise = () => {


  const [loading, setLoading] = useState(false);
  const {authId} = useAuthId();
  
  const isOnline = useNetworkStatus();

  const getPromises = async () => {
    setLoading(true);
    try {
      
      if (!isOnline){
        return toast.error("You are offline")
      }
      const res = await fetch(`${config.API_URL}/api/promise/get`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: authId}),
      });

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
    try {
      const res = await fetch(`${config.API_URL}/api/promise/new`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: authId, promise, coins}),
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

  const editPromise = async (id, promise) => {
    try {
      const res = await fetch(`${config.API_URL}/api/promise/edit`, {
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
      const res = await fetch(`${config.API_URL}/api/promise/delete`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id}),
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

  const updatePromise = async (id, coins) => {
    try {
      const res = await fetch(`${config.API_URL}/api/promise/update`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, coins, authId}),
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
  const getTotalDonations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.API_URL}/api/promise/total`, {
        method: "GET",
        // headers: {"Content-Type": "application/json"},
        // body: JSON.stringify({id, coins}),
      });

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
