

export const useLiveStream =()=>{
const startLive = (room)=>{
  try {
      const res = await fetch("/api/live/start", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: authUser._id}),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // setSessions(data);
     // console.log(data)
      return data 
    } catch (error) {
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
}

const endLive = (room) => {
try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: authUser._id}),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // setSessions(data);
     // console.log(data)
      return data 
    } catch (error) {
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
}
//get room latest session & end it or start it. 
}
