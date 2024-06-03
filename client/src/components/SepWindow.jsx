import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DiamondTimer, { DiamondTimerStyled } from "./DiamondTimer";
import styled from "styled-components";
import { MdOutlineArrowOutward } from "react-icons/md";

// Define your styled components outside of the NewWindowComponent
const GoalInput = styled.input`
  transition: width 1s;
`;

const Dots = styled.div`
  /* ... Your styles here ... */
`;

function SepWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const NewWindowComponent = ({ children,animationDuration }) => {
    const [container, setContainer] = useState(null);
    const newWindowRef = useRef(null);

    useEffect(() => {
      // Create a container <div> for our portal
      const div = document.createElement("div");
      setContainer(div);

      // Create a new window and keep a reference to it
      newWindowRef.current = window.open(
        "",
        "",
        "width=400,height=400,left=200,top=200"
      );

      // Append the container <div> to the new window's body
      newWindowRef.current.document.body.appendChild(div);
      newWindowRef.current.document.body.style.padding = '0';
      newWindowRef.current.document.body.style.margin = '0';
      // Include the styles in the new window's document
      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerHTML = `
      /* Include styles for Dots component here */
      .blink {
        animation: blink ${animationDuration}s infinite alternate;
      }
      @keyframes blink {
        50% { background-color: #fff; }
        100% { background-color: #6dc1e8; border-color: #fff; box-shadow: inset 5px 5px 10px 2px #89cff0, 0px 0px 15px 2px #89cff0; }
        0% { background-color: #e4f0f7; border-color: #6dc1e8; box-shadow: inset 0px 0px 10px 10px #e4f0f7, 0px 0px 5px 2px #6dc1e8; }
      }
    `;
      newWindowRef.current.document.head.appendChild(styleSheet);    

      // Bring the new window to the front
      newWindowRef.current.focus();
      setTimeout(function(){newWindowRef.current.focus()},10);


      // Add event listener to prevent resizing
      const handleResize = () => {
        // Set fixed dimensions to prevent resizing
        // ... Your resize logic here ...
      };
      newWindowRef.current.addEventListener("resize", handleResize);
      newWindowRef.current.addEventListener('beforeunload', () => setIsOpen(false));

      // Cleanup function to remove event listener and close the new window when the component unmounts
      return () => {
        newWindowRef.current.removeEventListener("resize", handleResize);
        window.removeEventListener('beforeunload', () => setIsOpen(false));
        newWindowRef.current.close();
      };
    }, [animationDuration]);

    // Render the children to the container <div> in the new window
    return container && createPortal(children, container);
  };
console.log(isOpen)
  return ( 
    <div>

      {isOpen && (
        <>
      <MdOutlineArrowOutward size={25} onClick={() => setIsOpen(true)} className="hover:cursor-pointer bg-base-300 hidden sm:flex " />
        <NewWindowComponent animationDuration={3}>
        <DiamondTimerStyled time={60} animationDuration={3} />
      </NewWindowComponent>
        </>
      )}
    </div>
  );
}

export default SepWindow;
