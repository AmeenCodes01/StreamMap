import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DiamondTimerStyled } from "./DiamondTimer";
import { MdOutlineArrowOutward } from "react-icons/md";
import useAuthId from "../hooks/useAuthId";

function SepWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const { key } = useAuthId();
  const windowRef = useRef(null);


useEffect(()=>{
  setIsOpen(localStorage.getItem(`${key}isOpen`))
  console.log(localStorage.getItem(`${key}isOpen`))
}, [])



const openNewWindow = () => {
  setIsOpen(true);
  localStorage.setItem(`${key}isOpen`,isOpen)
};

  
  useEffect(() => {
    // Function to close any existing popup
    const closeExistingPopup = () => {
      const existingPopup = window.open('', 'TimerPopup');
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

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      closeExistingPopup();
    };
  }, []);


  const NewWindowComponent = ({ children }) => {
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

        const handleResize = () => {
          windowRef.current.resizeTo(200, 180);
        };
        windowRef.current.addEventListener("resize", handleResize);

        windowRef.current.addEventListener("beforeunload", () => {
          setIsOpen(false);
        });

        return () => {
          windowRef.current.removeEventListener("resize", handleResize);
          windowRef.current.removeEventListener("beforeunload", () => setIsOpen(false));
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