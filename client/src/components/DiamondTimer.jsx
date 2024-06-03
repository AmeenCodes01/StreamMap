// import React, {useState, useEffect} from "react";

// function DiamondTimer({time}) {
//     const [nextFive, setFive] = useState(0);
//     const [min, setMin] = useState(time||60);
//     const [seshStart, setStartSesh] = useState(false);

//     useEffect(() => {
//         let interval = null;

//         if (seshStart === true && nextFive < min / 5) {
//           interval = setInterval(() => {
//             setFive(nextFive + 1);
//             // setStartSesh(false);
//           }, 1000 * 5);
//         } else {
//           clearInterval(interval);
//           setStartSesh(false);
//           nextFive > 0 ? setShowSeshRate(true) : null;
//           setFive(0);
//         }
//         return () => {
//           clearInterval(interval);
//         };
//       }, [nextFive,seshStart]);
//   return (
//     <div>
//          <div className="grid-col-3  flex  flex-wrap  ">
//               {Array(min/5)
//                 .fill(true)
//                 .map((_, i) => {
//                   return (
//                     <div className="m-[10px]" key={i}>
//                       <Dots
//                         className=" h-[15px] w-[15px] sm:h-[19px] sm:w-[19px]"
//                         duration={i === nextFive && seshStart ? 3 : 0}></Dots>
//                     </div>
//                   );
//                 })}
//             </div>
//     </div>
//   )
// }

// export default DiamondTimer

import React, { useState, useEffect } from "react";
import styled from "styled-components";

const GoalInput = styled.input`
  transition: width 1s;
`;

const Dots = styled.div`
  animation: blink ${(props) => `${props.duration}s` || `${0}s`} infinite
    alternate;
  background-color: #6dc1e8;
  transform: rotate(45deg);
  border-width: 1.5px;
  @keyframes blink {
    50% {
      background-color: #fff;
    }
    100% {
      background-color: #6dc1e8;
      border-color: #fff;
      box-shadow: inset 5px 5px 10px 2px #89cff0, 0px 0px 15px 2px #89cff0;
    }

    0% {
      background-color: #e4f0f7;
      border-color: #6dc1e8;
      box-shadow: inset 0px 0px 10px 10px
          ${(props) => (props.duration === 2 ? `#1f75fe` : `#e4f0f7`)},
        0px 0px 5px 2px #${(props) => (props.duration === 2 ? `#000` : `#6dc1e8`)};
    }
  }
`;

function DiamondTimer({ time }) {
  const [nextFive, setFive] = useState(0);
  const [min, setMin] = useState(time || 60);
  const [seshStart, setStartSesh] = useState(false);

  useEffect(() => {
    let interval = null;

    if (seshStart === true && nextFive < min / 5) {
      interval = setInterval(() => {
        setFive(nextFive + 1);
      }, 1000 * 5);
    } else {
      clearInterval(interval);
      setStartSesh(false);
      nextFive > 0 ? setShowSeshRate(true) : null;
      setFive(0);
    }
    return () => {
      clearInterval(interval);
    };
  }, [nextFive, seshStart]);

  // useEffect(() => {
  //   if (seshStart) {
  //     // Open a new window when session starts
  //     const newWindow = window.open("", "_blank");
  //     newWindow.document.body.innerHTML = `
  //       <div style="padding: 20px;">
  //         <DiamondTimerStyled time={time} />
  //       </div>
  //     `;
  //   }
  // }, [seshStart, time]);

  return (
    <div
      style={{
        backgroundColor: "#1F305E",
        height: "100%",
        padding: "10px",
      }}
    >
      <button onClick={() => setStartSesh(!seshStart)}>w</button>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {Array(min / 5)
          .fill(true)
          .map((_, i) => {
            return (
              <div className="m-[10px]" key={i}>
                <div
                  className={`h-[15px] w-[15px] sm:h-[19px] sm:w-[19px] ${
                    i === nextFive && seshStart ? "blink" : ""
                  }`}
                  User
                  style={{
                    backgroundColor:
                      (i === nextFive && seshStart) ||
                      (i <= nextFive && seshStart)
                        ? "#fff"
                        : "#6dc1e8", // Lighter shade if animated, darker shade otherwise
                    borderColor:
                      i === nextFive && seshStart ? "#6dc1e8" : "#fff", // Darker shade if animated, lighter shade otherwise
                    boxShadow:
                      i === nextFive && seshStart
                        ? "inset 0px 0px 10px 10px #e4f0f7, 0px 0px 5px 2px #6dc1e8"
                        : "inset 5px 5px 10px 2px #89cff0, 0px 0px 15px 2px #89cff0", // Darker shadow if animated, lighter shadow otherwise
                    height: "15px",
                    width: "15px",
                    marginRight: "15px",
                    transform: " rotate(45deg)",
                  }}
                ></div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export const DiamondTimerStyled = styled(DiamondTimer)``;

export default DiamondTimer;
