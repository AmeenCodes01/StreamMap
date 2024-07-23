import  { useEffect } from 'react';
import {useNetworkStatus} from '../hooks/useNetworkStatus';
import toast from "react-hot-toast";





const NetworkNotifier = () => {
  const isOnline = useNetworkStatus();
    console.log(isOnline,"isOnline")
  useEffect(() => {
    if (!isOnline) {
      toast.error('You are offline.', {
        toastId: 'offline-toast', // Prevents duplicate toasts
        autoClose: false, // Toast will stay until dismissed or network is restored
      });
    } else {
      toast.dismiss('offline-toast');
      toast.success('You are back online!', { autoClose: 3000 });
    }
  }, [isOnline]);

  return null; // This component doesn't render anything
};  

export default NetworkNotifier;  