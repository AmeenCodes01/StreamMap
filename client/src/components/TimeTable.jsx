import { useState, useEffect, memo } from "react";
import { Table } from "react-daisyui";
import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import useGetUsers from "../hooks/useGetUsers"


const UserTimes = memo((c) => {
  console.log(c);
  return (
    <>
      <h2
        style={{
          backgroundColor: c?.user.users[0].color,
        }}
      >
        {c.user.country}
      </h2>
    </>
  );
});


function TimeTable({  toggleVisible }) {
  const [render, setRender] = useState(false);
  const [sameUsers, setSameUsers] = useState([]);

  
  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      setRender(!render);
    }, 1000 * 55);

    return () => {
      clearInterval(interval);
    };
  }, [render]);
  //Add all joined room as array to users.

  function getCurrentTimeInTimeZone(timeZone) {
    // Create a new Date object with the current time
    const currentTime = new Date();
  
    // Format the current time for the specified time zone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false // Use 24-hour format to avoid AM/PM confusion
    });
  
    // Use formatToParts to get the individual parts of the formatted time
    const parts = formatter.formatToParts(currentTime);
  
    // Extract hours and minutes from the parts
    let hours, minutes;
    for (const part of parts) {
      if (part.type === 'hour') {
        hours = part.value;
      } else if (part.type === 'minute') {
        minutes = part.value;
      }
    }
  
    // Return the formatted time as HH:MM
    return `${hours}:${minutes}`;
}

// Example usage



  
  
  const { authUser } = useAuthContext();
  const { onlineUsers } = useSocketContext();
  const { users, loading } = useGetUsers();
console.log(users)

  // positive negative, negative negative, positive positive
  // -7 , 5  , 5.5
  const timeDiff = (authOffset, offset) => {
    //both negative
    let diff = parseFloat(authOffset) - parseFloat(offset);
    diff = diff < 0 ? diff * -1 : diff;
    return `${parseInt(diff)}h ${(diff - parseInt(diff)) * 60}min`;
  };

  //SHOW OFFSET FROM USER CXOUNTRY. SHAMS AT TOP. SHOW NAME, STYLE IMAGES.
  useEffect(() => {
    if (onlineUsers[0] !== undefined && users.length !== 0){

    
    const online = onlineUsers.map((ou) => {
      let onlineuser;
      users.map((u) => {
        if (ou === u._id) {
          onlineuser = u;
        }
      });
      return onlineuser;
    });
    console.log(online);
    console.log(onlineUsers);
    console.log(users);
if (online[0] !== undefined){

  let singleCountries = online?.map((x) => x.country);
  singleCountries = [...new Set(singleCountries)];
  
  const sameUsers = singleCountries.map((c) => {
    let users = [];
    let timeZone;
    online.map((x) => {
      if (x.country === c) {
        timeZone = x.timeZone;
        users.push({
          name: x.name,
          picture: x.profilePic,
          color: x.color,
        });
      }
    });
    return { users: users, country: c, timeZone: timeZone };
  });
  setSameUsers(sameUsers);
}}
}, [onlineUsers, users]);

if (loading){
  return;
}
console.log(sameUsers)

  return (
    <div className="max-h-[75vh] overflow-auto pt-[20px] ">
      <svg
        height="25px"
        onClick={toggleVisible}
        id="Layer_1"
        className="fill-primary mt-[-15px] mb-[20px]  "
        version="1.1"
        viewBox="0 0 512 512"
        width="30px"
        xml:space="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <polygon points="160,128.4 192.3,96 352,256 352,256 352,256 192.3,416 160,383.6 287.3,256 " />
      </svg>

      {sameUsers.length > 0
        ? sameUsers.map((c) => {
            return (
              <div className=" mb-10 bg-base-200">
                <div
                  className="flex flex-row w-[100%]  border-2 border-white "
                  style={{
                    backgroundColor: c?.users[0].color,
                  }}
                >
                  <h6
                    className="text-md bg-white ml-[10px]  px-2 text-start    "
                    style={
                      {
                                         backgroundColor: c?.users[0].color,
                      }
                    }
                  >
                    {c.country}
                  </h6>
                </div>

                <p className=" flex flex-row     ">
                  <p className="badge  badge-md badge-primary rounded-[0.2px]">
                    {getCurrentTimeInTimeZone(c.timeZone)}
                  </p>
                  {/* <span className="ml-[auto] badge  rounded-[2px] badge-md ">
                {timeDiff(authUser.offset, c.offset)}
                  </span> */}
                </p>
                <div>
                  {c.users.length > 0
                    ? c?.users?.map((x) => (
                        <li className="flex flex-col gap-[12px] ">
                          <ul className="  flex flex-row px-[10px] py-[15px]">
                            <div className="avatar">
                              <div className="w-8 rounded-full ring ring-primary  ring-offset-base-100 ring-offset-1">
                                <img
                                  src={`${x.picture}`}
                                  //                          className=" w-[38px] h-[38px] rounded-[100px]   "
                                />
                              </div>
                              <p className="prose prose-md self-center ml-[10px] ">
                                {x.name}
                              </p>
                              {/* <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
                            </div>
                          </ul>
                         
                        </li>
                      ))
                    : null}
                </div>
              </div>
            );

            {
              /* </div> */
            }
          })
        : null}
    </div>
  );
}

export default TimeTable;
