import React from "react";
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import ManageProfile from "./Components/ManageProfile/ManageProfile";
import NotFound from "./Components/NotFound";
import PrivateRoute from "./hocs/PrivateRoute";
import UnPrivateRoute from "./hocs/UnPrivateRoute";
import Footer from "./Components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDarkTheme } from "./hooks/useDarkTheme";

const App = () => {
	toast.configure({autoClose: 2500, draggable: false});
	const [ theme, toggleDarkTheme ] = useDarkTheme();
	const themeConfig = createMuiTheme(theme);

	return (
		<ThemeProvider theme={themeConfig}>
			<CssBaseline />
			<Router basename={process.env.PUBLIC_URL}>
				<Header themeType={themeConfig.palette.type} toggleDarkTheme={toggleDarkTheme} />
				<div style={{minHeight: "calc(100vh - 75px)", paddingBottom: 40}}>
					<Switch>
						<Route exact path="/" component={Home} />
						<UnPrivateRoute exact path="/login" component={Login} />
						<UnPrivateRoute exact path="/register" component={Register} />
						<PrivateRoute exact path="/dashboard" component={Dashboard} />
						<PrivateRoute exact path="/profile" component={ManageProfile} />
						<Route path ="/not-found" component={NotFound} />
						<Redirect to="/not-found" />
					</Switch>
				</div>
				<Footer />
			</Router>
		</ThemeProvider>
	);
};

export default App;