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
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import AuthService from "../Services/AuthService";
import { AuthContext } from "../Context/AuthContext";
import PropTypes from "prop-types";
import Message from "./Message";

const useStyles = makeStyles((theme) => ({
	gridItem: {
		paddingTop: 20
	},
	createAccountItem: {
		paddingRight: 60
	}
}));

const Login = (props) => {
	const classes = useStyles();
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ showPassword, setShowPassword ] = useState(false);
	const [ message, setMessage ] = useState({msgBody: "", msgError: false});
	const authContext = useContext(AuthContext);

	function login() {
		if(email === "" && password === "") {
			setMessage({msgBody: "Username and password are required fields", msgError: true});
		} else if(email === "") {
			setMessage({msgBody: "Username is a required field", msgError: true});
		} else if(password === "") {
			setMessage({msgBody: "Password is a required field", msgError: true});
		} else {
			AuthService.login({email, password}).then(data => {
				const { isAuthenticated, user } = data;
				if(isAuthenticated) {
					setMessage({msgBody: "Successfully logged in", msgError: false});
					authContext.setUser(user);
					authContext.setIsAuthenticated(isAuthenticated);
					props.history.push("/dashboard");
				} else {
					setEmail("");
					setPassword("");
					setMessage({msgBody: "Invalid username or password", msgError: true});
				}
			});
		}
	}

	return (
		<Fragment>
			<Typography color="secondary" align="center" variant="h4">Login</Typography>
			<Grid container direction="column" alignItems="center">
				<Grid item className={classes.gridItem}>
					<Message width="600px" message={message} setMessage={setMessage} />
				</Grid>
				<Grid item className={classes.gridItem}>
					<TextField margin="normal" value={email} onChange={(event) => setEmail(event.target.value)} 
						name="email" label="Email" variant="outlined" color="secondary"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton edge="end" onClick={() => setEmail("")}>
										{email !== "" && <ClearIcon />}
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
				</Grid>
				<Grid item className={classes.gridItem}>
					<TextField color="secondary" value={password} label="Password"
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