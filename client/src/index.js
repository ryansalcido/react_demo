import "react-app-polyfill/ie11";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AuthProvider from "./Context/AuthContext";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers/rootReducer";
import "typeface-roboto";

const store = createStore(rootReducer);

ReactDOM.render(<Provider store={store}><AuthProvider><App /></AuthProvider></Provider>, document.getElementById("root"));