import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {AuthContextProvider} from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import {Theme} from "react-daisyui";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="521506792065-ifgqo0ji7f4j26qcpf0ajomqnhtf0h1e.apps.googleusercontent.com">
    {/* <React.StrictMode> */}
      <AuthContextProvider>
        <Theme dataTheme="autumn">
      <SocketContextProvider>
          <App />

          </SocketContextProvider>
        </Theme>
      </AuthContextProvider>
    {/* </React.StrictMode> */}
  </GoogleOAuthProvider>
);
       