import React, { createContext, useState, useEffect } from "react";
import AuthService from "../Services/AuthService";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: "100vh",
		position: "relative"
	}
}));

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const classes = useStyles();

	const [ user, setUser ] = useState(null);
	const [ isAuthenticated, setIsAuthenticated ] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		AuthService.isAuthenticated().then(data => {
			setUser(data.user);
			setIsAuthenticated(data.isAuthenticated);
			setIsLoaded(true);
		});
	}, []);

	return (
		<div className={classes.root}>
			{!isLoaded
				? <h1>Loading</h1>
				: <AuthContext.Provider value={{user, setUser, isAuthenticated, setIsAuthenticated}}>
					{ children }
				</AuthContext.Provider>
			}
		</div>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.object.isRequired
};

export default AuthProvider;