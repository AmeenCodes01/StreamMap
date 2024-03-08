import styled from "styled-components";

export const GoalInput = styled.input`
  transition: width 1s;
`;

export const Dots = styled.div`
  animation: blink ${(props) => `${props.duration}s` || `${0}s`} infinite
    alternate;
  transform: rotate(45deg);
  border-width: 1.5px;
  /* background-color: #6dc1e8;  */
  /* border-radius: 100%; */
  /* box-shadow: inset 0px 0px 10px 10px
      ${(props) => (props.duration === 2 ? `#1f75fe` : `#6dc1e8`)},
    0px 0px 10px 3px
      ${(props) => (props.duration === 2 ? `#1f75fe` : `#6dc1e8`)}; */
  @keyframes blink {
    50% {
      background-color: #fff;
    }
    100% {
      background-color: #6dc1e8;
      border-color: #fff;
      /* ${(props) => (props.duration === 2 ? `#0000FF` : `#6dc1e8`)}; */
      /* ${(props) => props.duration} === 2 ? #1f75fe : #6dc1e8; */
      box-shadow: inset 5px 5px 10px 2px #89cff0, 0px 0px 15px 2px #89cff0;
    }

    0% {
      background-color: #e4f0f7;
      border-color: #6dc1e8;
      box-shadow: inset 0px 0px 10px 10px
          ${(props) => (props.duration === 2 ? `#1f75fe` : `#e4f0f7`)},
        0px 0px 5px 2px #${(props) => (props.duration === 2 ? `#000` : `#6dc1e8`)};

      /* Second color - black */
    }
  }
`;
