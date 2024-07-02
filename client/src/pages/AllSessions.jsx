import React, {useEffect, useState} from "react";
import useGetSessions from "../hooks/useGetSessions";
import {SessionTable} from "../components/SessionTable";
import {useSocketContext} from "../context/SocketContext";
import useListenSessions from "../hooks/useListenSession";
import {useParams} from "react-router-dom";
import useStore from "../context/TimeStore";

function AllSessions() {
  const {loading, sessions, getSessions} = useGetSessions();
  const {allSessions, setAllSessions} = useStore((state) => ({
    allSessions: state.allSessions,
    setAllSessions: state.setAllSessions,
  }));
  const {id: room} = useParams();

  useEffect(() => {
    const getSesh = async () => {
      const data = await getSessions(room);
      if (data) setAllSessions(data);
    };

    getSesh();
  }, []);

  useListenSessions();
  if (loading) {
    return <span className="loading loading-infinity loading-md"></span>;
  }
  return (
    <div className="flex">
      <SessionTable arr={allSessions} table={"all"} />
    </div>
  );
}

export default AllSessions;
