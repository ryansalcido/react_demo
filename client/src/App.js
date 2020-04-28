import React, { useState } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import PrivateRoute from "./hocs/PrivateRoute";
import UnPrivateRoute from "./hocs/UnPrivateRoute";
import themeObject from "./theme";
import Footer from "./Components/Footer";

const useDarkTheme = () => {
	if(localStorage.getItem("type")) {
		themeObject.palette.type = localStorage.getItem("type");
	}
	const [ theme, setTheme ] = useState(themeObject);

	const { palette: { type }} = theme;
	const toggleDarkTheme = () => {
		const updatedTheme = {
			...theme,
			palette: {
				...theme.palette,
				type: type === "light" ? "dark" : "light"
			}
		};
		localStorage.setItem("type", updatedTheme.palette.type);
		setTheme(updatedTheme);
	};
	return [ theme, toggleDarkTheme ];
};

function App() {
	const [ theme, toggleDarkTheme ] = useDarkTheme();
	const themeConfig = createMuiTheme(theme);
	return (
		<ThemeProvider theme={themeConfig}>
			<CssBaseline />
			<Router>
				<Header themeType={themeConfig.palette.type} toggleDarkTheme={toggleDarkTheme} />
				<div style={{minHeight: "calc(100vh - 75px)", paddingBottom: 40}}>
					<Route exact path="/" component={Home} />
					<UnPrivateRoute path="/login" component={Login} />
					<UnPrivateRoute path="/register" component={Register} />
					<PrivateRoute path="/dashboard" component={Dashboard} />
				</div>
				<Footer />
			</Router>
		</ThemeProvider>
	);
}

export default App;