import React, { Fragment, useState, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import InputAdornment from "@material-ui/core/InputAdornment";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Alert from "@material-ui/lab/Alert";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import AuthService from "../Services/AuthService";
import { AuthContext } from "../Context/AuthContext";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	gridItem: {
		paddingTop: 20
	},
	createAccountItem: {
		paddingRight: 60
	},
	loginAlertError: {
		width: 600
	}
}));

const Login = (props) => {
	const classes = useStyles();
	const [ username, setUsername ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ showPassword, setShowPassword ] = useState(false);
	const [ viewLoginError, setViewLoginError ] = useState({error: false, msg: false});
	const authContext = useContext(AuthContext);

	function login() {
		if(username === "" && password === "") {
			setViewLoginError({error: true, msg: "Username and password are required fields"});
		} else if(username === "") {
			setViewLoginError({error: true, msg: "Username is a required field"});
		} else if(password === "") {
			setViewLoginError({error: true, msg: "Password is a required field"});
		} else {
			AuthService.login({username, password }).then(data => {
				const { isAuthenticated, user } = data;
				if(isAuthenticated) {
					setViewLoginError({error: false, msg: ""});
					authContext.setUser(user);
					authContext.setIsAuthenticated(isAuthenticated);
					props.history.push("/dashboard");
				} else {
					setUsername("");
					setPassword("");
					setViewLoginError({error: true, msg: "Invalid username or password"});
				}
			});
		}
	}

	return (
		<Fragment>
			<Typography color="secondary" align="center" variant="h4">Login</Typography>
      
			<Grid container direction="column" alignItems="center">
				<Grid item className={classes.gridItem}>
					{ viewLoginError.error === true && 
            <Alert className={classes.loginAlertError} severity="error" 
            	action={<ClearIcon onClick={() => setViewLoginError(false)} />}>
            	{viewLoginError.msg}
            </Alert>
					}
				</Grid>
				<Grid item className={classes.gridItem}>
					<TextField margin="normal" value={username} onChange={(event) => setUsername(event.target.value)} 
						name="username" label="Username" variant="outlined" color="secondary"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton edge="end" onClick={() => setUsername("")}>
										{username !== "" && <ClearIcon />}
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
				</Grid>
				<Grid item className={classes.gridItem}>
					<TextField color="secondary" value={password} label="Password" required
						name="password" type={showPassword ? "text" : "password"} variant="outlined"
						onChange={(event) => setPassword(event.target.value)}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton edge="end" onClick={() => setPassword("")}>
										{password !== "" && <ClearIcon />}
									</IconButton>
									<IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
										{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
				</Grid>
			</Grid>

			<Grid container direction="row" alignItems="center" justify="center">
				<Grid item className={`${classes.gridItem} ${classes.createAccountItem}`}>
					<Button color="secondary" variant="contained" component={Link} to={"/register"}>register</Button>
				</Grid>
				<Grid item className={classes.gridItem}>
					<Button color="primary" variant="contained" startIcon={<ExitToAppIcon />} onClick={() => login()}>
            sign in
					</Button>
				</Grid>
			</Grid>
		</Fragment>
	);
};

Login.propTypes = {
	history: PropTypes.object.isRequired
};

export default Login;