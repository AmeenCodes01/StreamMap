import usePromise from "../../hooks/usePromise";
import {useEffect, useState} from "react";

function DonationInfo() {
  const [totalDon, setTotalDon] = useState();
  const {getTotalDonations} = usePromise();

  useEffect(() => {
    const getTotalDonate = async () => {
      const data = await getTotalDonations();
      if (data) {
        setTotalDon(data);
      }
    };

    getTotalDonate();
  }, []);

  return (
    <div className=" badge   text-md ">
      <span className="text-bold italic font-mono  rounded-[8px] p-[5px] text-white ">
        <span className="bg-white badge text-primary text-bold text-md">
          Total {Math.floor(parseInt(totalDon) / 2)}$
        </span>{" "}
        promised to be donated to Palestine 🤍
      </span>
    </div>
  );
}

export default DonationInfo;
