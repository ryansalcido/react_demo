import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import theme from "./theme";
import { ThemeProvider } from '@material-ui/core/styles';
import Header from "./Components/Header";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import PrivateRoute from "./hocs/PrivateRoute";
import UnPrivateRoute from "./hocs/UnPrivateRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header />
        <Route exact path="/" component={Home} />
        <UnPrivateRoute path="/login" component={Login} />
        <UnPrivateRoute path="/register" component={Register} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
      </Router>
    </ThemeProvider>
  );
}

export default App;