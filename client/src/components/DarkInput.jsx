import React from "react";

export default function DarkInput({
  onChange,
  width,
  placeholder = "",
  value,
  min,
  max,
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      className=" px-[5px] py-[2px] ml-[5px] h-auto border-bottom border-1px text-center border-secondary focus:outline-none  placeholder:text-xs "
      style={{
        width: `${width}px`,
      }}
      min={min}
      max={max}
      placeholder={`${placeholder}`}
    />
  );
}
