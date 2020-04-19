import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Signup from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import theme from "./theme";
import { ThemeProvider } from '@material-ui/core/styles';
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer";

const routing = (
  <ThemeProvider theme={theme}>
    <Router>
      <div className="main">
        <Header />
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/register" component={Signup} />
          <Route path="/login" component={Login} />
        </Switch>
        <Footer />
      </div>
    </Router>
  </ThemeProvider>
)
ReactDOM.render(routing, document.getElementById("root"))

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
