import React, {useEffect} from "react";
import SessionTable from "./SessionTable";
import useStore from "../context/TimeStore";
import {useShallow} from "zustand/react/shallow";
import useGetSessions from "../hooks/useGetSessions";
function UserSessions() {
  const {getUserSessions} = useGetSessions();
  const {seshInfo} = useStore(
    useShallow((state) => ({
      seshInfo: state.seshInfo,
    }))
  );
  useEffect(() => {
    getUserSessions();
  }, []);
  return (
    <div className="h-[90%] flex w-[86%] mr-[auto] ml-[auto] justify-center  flex-col ">
      <h2 className="text-xl mb-[5px]">Sessions for the past 24 hours</h2>
      <SessionTable arr={seshInfo} />
    </div>
  );
}

export default React.memo(UserSessions);
