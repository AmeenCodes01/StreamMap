import React, {useEffect, useState} from "react";
import {SiCoffeescript} from "react-icons/si";
import BeanIcons from "./BeanIcons";
import {useHealthContext} from "../context/HealthContext";
import useAuthId from "../hooks/useAuthId";
function MoodTracker() {
  const {authId} = useAuthId();
  const moodDictionary = [
    {text: "amazing", color: "#be7261"},
    {text: "ok", color: "#9f5754"},
    {text: "tired", color: "#7d4448"},
    {text: "sad", color: "#683842"},
    {text: "stressed", color: "#492233"},
  ];
  //make it auth specigiv
  const {mood, setMood} = useHealthContext();
  const [moodColor, setMoodColor] = useState(
    localStorage.getItem("mood")
      ? moodDictionary.find(
          (moodObj) => moodObj.text === localStorage.getItem(`${authId}mood`)
        ).color
      : ""
  );

  useEffect(() => {
    localStorage.setItem(`${authId}mood`, mood);
  }, [mood, moodColor]);

  return (
    <div>
      <div className="  flex flex-row     max-w-full max-h-full   ">
        <div className="  flex  items-center w-full h-full justify-items-center gap-[5px]  ">
          {moodDictionary.map((item, index) => (
            <BeanIcons
              key={index}
              color={item.color}
              text={item.text}
              setMood={setMood}
              setMoodColor={setMoodColor}
            />
          ))}
        </div>
      </div>
      <SiCoffeescript
        size={120}
        style={{
          color: mood !== "" ? moodColor : "#d29272",
          transition: "color 0.5s ease-in-out", // Smooth transition over 0.3 seconds
        }}
      />
    </div>
  );
}

export default MoodTracker;
