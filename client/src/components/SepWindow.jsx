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

function SepWindow({open}) {
  const [isOpen, setIsOpen] = useState(open);
  const [seconds, setSeconds] = useState()

  const NewWindowComponent = ({ children, }) => {
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
        "width=200,height=200,left=200,top=200"
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
         animation: blink 15s infinite alternate;
      }
      @keyframes blink {
        50% { background-color: #0d02e0;
         box-shadow: inset 5px 5px 5px 2px #89cff0, 0px 0px 15px 2px #89cff0; }
        100% { background-color: #6dc1e8; border-color: #fff; 
         }
        0% { background-color: #e4f0f7; border-color: #0d064d;  
        box-shadow: inset 0px 0px 10px 10px #0d064d, 0px 0px 5px 2px #0d064d;  }
      }
         body::-webkit-scrollbar {
    display: none;
  }
  body {
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: none;
  }
    `;
    //box-shadow: inset 5px 5px 10px 2px #89cff0, 0px 0px 15px 2px #89cff0;
    //0% ------ box-shadow: inset 0px 0px 10px 10px #e4f0f7, 0px 0px 5px 2px #6dc1e8;
      newWindowRef.current.document.head.appendChild(styleSheet);    

      // Bring the new window to the front
      newWindowRef.current.focus();
      setTimeout(function(){newWindowRef.current.focus()},10);


      // Add event listener to prevent resizing
      const handleResize = () => {
        // Set fi|xed dimensions to prevent resizing
        newWindowRef.current.resizeTo(200, 180);
        
      };
      newWindowRef.current.addEventListener("resize", handleResize);
      newWindowRef.current.addEventListener('beforeunload', () => setIsOpen(false));

      // Cleanup function to remove event listener and close the new window when the component unmounts
      return () => {
        newWindowRef.current.removeEventListener("resize", handleResize);
        window.removeEventListener('beforeunload', () => setIsOpen(false));
        newWindowRef.current.close();
      };
    }, []);

    // Render the children to the container <div> in the new window
    return container && createPortal(children, container);
  };
 
// console.log(isOpen,"isOpen I am inside")
  
  return ( 
    <div>
   
   <MdOutlineArrowOutward size={25} 
   onClick={() => setIsOpen(true)}
   
   className="hover:cursor-pointer bg-base-300 hidden sm:flex " />

      {isOpen && (
        <>
        <NewWindowComponent >
        <DiamondTimerStyled setIsOpen={setIsOpen}  />
      </NewWindowComponent>
        </>
       )} 
    </div>
  );
}

export default SepWindow;
