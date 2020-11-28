import React, { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import axiosInstance from "../utils/axiosInstance";

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: "100vh",
		position: "relative"
	},
	loadingBackground: {
		minHeight: "inherit",
		backgroundColor: theme.palette.grey.A100,
		padding: 0,
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	}
}));

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const classes = useStyles();

	const [ user, setUser ] = useState(null);
	const [ isAuthenticated, setIsAuthenticated ] = useState(false);
	const [ isLoaded, setIsLoaded ] = useState(false);

	useEffect(() => {
		let source = axiosInstance.CancelToken.source();
		axiosInstance.get("user/authenticated", {cancelToken: source.token}).then(res => {
			const { user, isAuthenticated } = res.data;
			if(user && isAuthenticated) {
				setUser(user);
				setIsAuthenticated(isAuthenticated);
				setIsLoaded(true);
			}
		}).catch(error => {
			setUser({name: "", email: ""});
			setIsAuthenticated(false);
			setIsLoaded(true);
		});
    
		return () => source.cancel();
	}, []);

	const manageUserSession = useCallback((user, isAuthenticated) => {
		setUser(user);
		setIsAuthenticated(isAuthenticated);
	}, []);

	return (
		<div className={classes.root}>
			{!isLoaded 
				? <div className={classes.loadingBackground}>
					<CircularProgress color="secondary" />
				</div>
				: <AuthContext.Provider value={{user, setUser, isAuthenticated, setIsAuthenticated, manageUserSession}}>
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