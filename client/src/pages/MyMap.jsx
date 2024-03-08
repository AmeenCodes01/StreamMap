import React, {useState, useEffect} from "react";

import TimeTable from "../components/TimeTable";
import Tracker from "../components/Tracker";
import Map from "../components/Map";
import coord from "../data/longLat.json";
import mapData from "../data/countries.json";
import axios from "axios";
import {useParams} from "react-router-dom";
import LoginModal from "../components/LoginModal";
import {io} from "socket.io-client";
import useWindowDimensions from "../hooks/dimensionsHook";
import {useAuthContext} from "../context/AuthContext";
import useLogin from "../hooks/useLogin";
import useGetUsers from "../hooks/useGetUsers";
const MyMap = () => {
  const [center, setCenter] = useState([40, 0]);
  // myCountry saves user country
  const [key, setKey] = useState(1);
  const [countries, setCountries] = useState([]);
  // saves country, color + offset
  const [selectedMap, setSelectedMapData] = useState([]);
  // selectedMap saves geoJSON of selected country.
  const [zoomed, setZoom] = useState(false);
  const [topGrad, setTopGrad] = useState("rgb(178, 210, 222)");
  const [botGrad, setBotGrad] = useState("rgb(116, 192, 219)");
  const [socket, setSocket] = useState();

  const [showJoin, setJoin] = useState(true);
  const {id: room} = useParams();
  const {height, width} = useWindowDimensions();

  const [modalOpen, setModalOpen] = useState(true);
  const [profile, setProfile] = useState([]);

  const {authUser, setAuthUser} = useAuthContext();
  const {users} = useGetUsers();

  const [loading, setLoading] = useState();
  //write this into a useEffect.

  const {login} = useLogin();
  //get all users by room. get room name from params.
  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);
  console.log(users);
  // useEffect(() => {
  //   const getUsers = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch("/api/users");
  //       const data = await res.json();
  //       if (data.error) {
  //         throw new Error(data.error);
  //       }
  //       console.log(data);
  //       setUsers(data);
  //     } catch (error) {
  //       // toast.error(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getUsers();
  // }, []);
  // useEffect(() => {
  //   if (socket !== null) {
  //     socket.emit("join-room", {room});
  //   }
  //   // socket.join("Shamsia");
  // }, []);
  useEffect(() => {
    setKey(key + 1);
  }, [users]);

  useEffect(() => {
    if (socket == null) return;
    const handler = (e) => {
      setUsers([...users, e.info]);
      console.log(e);
    };
    socket.on("receive_user_join", handler);

    return () => {
      socket.off("receive_user_join");
    };
  }, [socket]);

  useEffect(() => {
    if (socket == null) return;
    const handler = (e) => console.log(e);
    socket.on("receive_StartGoal", (message) => {
      console.log(message);
    });
    return () => {
      socket.off("receive_StartGoal", handler);
    };
  }, [socket]);

  useEffect(() => {
    if (socket == null) return;
    const handler = (e) => console.log(e);
    socket.on("receive_join_room", (message) => {
      console.log(message);
    });
    return () => {
      socket.off("receive_join_room", handler);
    };
  }, [socket]);
  // useEffect(() => {
  //   //users by room
  //   // axios
  //   //   .get("/users")
  //   //   .then((response) => console.log(response.data))
  //   //   .catch((error) => console.error(error));
  //   // socket.emit("send-changes", authUser.color);
  //   // console.log(users);
  // }, [socket, users]);

  const onJoin = () => {
    let include = true;
    // for (let i = 0; i < countries.length; i++) {
    //   if (myCountry === countries[i].name) {
    //     include = true;
    //   }
    // }
    for (let i = 0; i < coord.ref_country_codes.length; i++) {
      if (coord.ref_country_codes[i].country === myCountry) {
        // console.log(coord.ref_country_codes[i].latitude);
        // console.log(coord.ref_country_codes[i].longitude);
        const arr = [
          coord.ref_country_codes[i].latitude,
          coord.ref_country_codes[i].longitude,
        ];
        setCenter([...arr]);
      }
    }

    // array of users, with their colours inside basically. And that will come from
    if (include == false) {
      setCountries([
        ...countries,
        {
          name: myCountry,
          color: authUser.color,
          offset: new Date().getTimezoneOffset(),
        },
      ]);
      setSelectedMapData([
        ...selectedMap,
        mapData.features.filter(
          (x) => x.properties.ADMIN === myCountry.value
        )[0],
      ]);
    }
    if (profile && authUser.color && myCountry) {
      const userInfo = {
        name: profile[0].given_name,
        profilePic: profile[0].picture,
        email: profile[0].email,
        country: myCountry,
        offset: new Date().getTimezoneOffset() / 60,
        color: authUser.color,
      };
      localStorage.setItem("auth-user", JSON.stringify(userInfo));
      setAuthUser(userInfo);
      login(userInfo);
      setModalOpen(false);
      socket.emit("user_join", {userInfo, room});
    }

    setZoom(true);

    setKey(key + 1);

    //Signed In + Color + Country

    // setJoin(false);
  };
  const onEachCountry = (country, layer) => {
    let countryName = country.properties.ADMIN;
    let color = "#e6dfdf";

    for (let i = 0; i < users.length; i++) {
      // console.log(countryName, users[i].country);

      if (countryName === users[i].country) {
        console.log(users[i].color);
        color = users[i].color;
      }
    }
    layer.setStyle({
      fillColor: color,
    });
    layer.bindPopup(countryName);
  };

  if (loading) {
    return;
  }
  return (
    <div
      className="w-[100%] h-[100%]   overflow-auto  flex flex-col border-[3px] relative   "
      style={
        {
          // backgroundColor: "rgb(116, 192, 219)",
        }
      }>
      <button
        onClick={async () => {
          try {
            const res = await fetch("/api/users");
            const data = await res.json();
            if (data.error) {
              throw new Error(data.error);
            }
            console.log(data);
            // setUsers(data);
          } catch (error) {
            // toast.error(error.message);
          }
        }}>
        ee
      </button>

      <Map
        center={center}
        id={key}
        zoomed={zoomed}
        onEachCountry={onEachCountry}
      />

      <div className="flex   pl-[10px]   ">
        {/* <p className="text-white self-center">color:</p> */}
        <label
          className=" rounded-[6px] "
          style={{backgroundColor: authUser.color, borderWidth: "0px"}}>
          <input
            type="color"
            value={authUser.color}
            className="w-[25px] h-[25px]  border-[0px] self-center  block opacity-0"
            style={{backgroundColor: authUser.color, borderWidth: "0px"}}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <p className="mx-[5px] "> {authUser.country}</p>
      </div>

      <TimeTable times={users} />
      {/* //Progress Tracker */}

      <div>
        <Tracker socket={socket} />
      </div>
      {/* Session goals, tracked */}
      <div className=" border-[1px]"></div>
    </div>
  );
};

export default MyMap;
