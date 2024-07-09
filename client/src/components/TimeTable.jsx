import {useState, useEffect, memo} from "react";
import {Table} from "react-daisyui";
import {useAuthContext} from "../context/AuthContext";
import {useSocketContext} from "../context/SocketContext";
import useGetUsers from "../hooks/useGetUsers";

const UserTimes = memo((c) => {
  const [render, setRender] = useState(0);
  console.log("rendeirng ");
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRender((prev) => prev + 0.0001);
    }, 10000); // Update every 30 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval
    };
  }, []);

  return (
    <>
      <p className="badge  badge-md badge-primary rounded-[0.2px] ">
        {getCurrentTimeInTimeZone(c.time)}
      </p>
    </>
  );
});

function getCurrentTimeInTimeZone(timeZone) {
  // Create a new Date object with the current time
  const currentTime = new Date();

  // Format the current time for the specified time zone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "numeric",
    hour12: false, // Use 24-hour format to avoid AM/PM confusion
  });

  // Use formatToParts to get the individual parts of the formatted time
  const parts = formatter.formatToParts(currentTime);

  // Extract hours and minutes from the parts
  let hours, minutes;
  for (const part of parts) {
    if (part.type === "hour") {
      hours = part.value;
    } else if (part.type === "minute") {
      minutes = part.value;
    }
  }

  return `${hours}:${minutes}`;
}

function TimeTable({toggleVisible}) {
  const [render, setRender] = useState(false);
  const [sameUsers, setSameUsers] = useState([]);

  const {users, loading} = useGetUsers();
  console.log(users, "users");
  if (loading) {
    return;
  }

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
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <polygon points="160,128.4 192.3,96 352,256 352,256 352,256 192.3,416 160,383.6 287.3,256 " />
      </svg>

      {Object.keys(users).map((country) => {
        return (
          <div className=" mb-10 bg-base-200">
            <div
              className="flex flex-row w-[100%]  border-2 border-white "
              style={{
                backgroundColor: users[country][0].color,
              }}
            >
              <h6
                className="text-md bg-white ml-[10px]  px-2 text-start    "
                style={{
                  color: users[country][0][0].color,
                }}
              >
                {country}
              </h6>
            </div>
            {/* what if same */}
            <p className=" flex flex-row     ">
              <p className="badge  badge-md badge-primary rounded-[0.2px] ">
                {/* {getCurrentTimeInTimeZone(c.timeZone)} */}
              </p>
              {/* <span className="ml-[auto] badge  rounded-[2px] badge-md ">
                {timeDiff(authUser.offset, c.offset)}
                  </span> */}
            </p>
            <div>
              {users[country].map((timeZone) => {
                if (typeof timeZone[0] !== "object") {
                  return;
                }
                return (
                  <>
                    <UserTimes time={timeZone[0].timeZone} />

                    {timeZone.map((user) => {
                      if (typeof user !== "object") {
                        return;
                      }

                      return (
                        <li className="flex flex-col gap-[12px] ">
                          <ul className="  flex flex-row px-[10px] py-[15px]">
                            <div className="avatar">
                              <div className="w-8 rounded-full ring ring-primary  ring-offset-base-100 ring-offset-1">
                                <img
                                  src={user.profilePic}
                                  className=" w-[40px] h-[40px]   "
                                />
                              </div>
                              <p className="prose prose-md self-center ml-[10px] ">
                                {user.name}
                              </p>
                              {/* <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
                            </div>
                          </ul>
                        </li>
                      );
                    })}
                  </>
                );
              })}
            </div>
          </div>
        );

        {
        }
      })}
    </div>
  );
}

export default TimeTable;
