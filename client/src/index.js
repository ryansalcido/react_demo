import "react-app-polyfill/ie11";
import "intersection-observer";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AuthProvider from "./Context/AuthContext";
import "typeface-roboto";

ReactDOM.render(<AuthProvider><App /></AuthProvider>, document.getElementById("root"));