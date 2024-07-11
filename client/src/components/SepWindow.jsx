import React, {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {DiamondTimerStyled} from "./DiamondTimer";
import {MdOutlineArrowOutward} from "react-icons/md";
import useAuthId from "../hooks/useAuthId";

function SepWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const {key} = useAuthId();
  const windowRef = useRef(null);

  useEffect(() => {
    setIsOpen(localStorage.getItem(`${key}isOpen`));
    console.log(localStorage.getItem(`${key}isOpen`));
  }, []);

  const openNewWindow = () => {
    setIsOpen(true);
    localStorage.setItem(`${key}isOpen`, isOpen);
  };

  useEffect(() => {
    // Function to close any existing popup
    const closeExistingPopup = () => {
      const existingPopup = window.open("", "TimerPopup");
      if (existingPopup) {
        existingPopup.close();
      }
    };

    // Close any existing popup when the component mounts
    closeExistingPopup();

    // Attempt to close the popup when the page is about to unload
    const handleBeforeUnload = () => {
      if (windowRef.current) {
        windowRef.current.close();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      closeExistingPopup();
    };
  }, []);

  const NewWindowComponent = ({children}) => {
    const [container, setContainer] = useState(null);

    useEffect(() => {
      const div = document.createElement("div");
      setContainer(div);

      windowRef.current = window.open(
        "",
        "TimerPopup",
        "width=200,height=200,left=200,top=200"
      );

      if (windowRef.current) {
        windowRef.current.document.body.appendChild(div);
        windowRef.current.document.body.style.padding = "0";
        windowRef.current.document.body.style.margin = "0";

        // Add your styles here
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
        windowRef.current.document.head.appendChild(styleSheet);

        const handleResize = () => {
          windowRef.current.resizeTo(200, 180);
        };
        windowRef.current.addEventListener("resize", handleResize);

        windowRef.current.addEventListener("beforeunload", () => {
          setIsOpen(false);
        });

        return () => {
          windowRef.current.removeEventListener("resize", handleResize);
          windowRef.current.removeEventListener("beforeunload", () =>
            setIsOpen(false)
          );
          windowRef.current.close();
        };
      }
    }, []);

    return container && createPortal(children, container);
  };

  return (
    <div>
      <MdOutlineArrowOutward
        size={25}
        onClick={openNewWindow}
        className="hover:cursor-pointer bg-base-300 hidden sm:flex"
      />

      {isOpen && (
        <NewWindowComponent>
          <DiamondTimerStyled setIsOpen={setIsOpen} isOpen={isOpen} />
        </NewWindowComponent>
      )}
    </div>
  );
}

export default SepWindow;
