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
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
	gridItem: {
		paddingTop: 20,
		width: "100%",
		textAlign: "center"
	},
	messageItem: {
		display: "flex",
		justifyContent: "center"
	},
	loginBtnsItem: {
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
	const authContext = useContext(AuthContext);

	const onSubmitLogin = () => {
		if(email === "" && password === "") {
			toast.error("Email and password are required fields");
		} else if(email === "") {
			toast.error("Email is a required field");
		} else if(password === "") {
			toast.error("Password is a required field");
		} else {
			AuthService.login({email, password}).then(data => {
				const { isAuthenticated, user } = data;
				if(isAuthenticated) {
					authContext.setUser(user);
					authContext.setIsAuthenticated(isAuthenticated);
					toast.success(`${user.name} has successfully logged in!`);
					props.history.push("/dashboard");
				} else {
					toast.error("Invalid username or password");
					setEmail("");
					setPassword("");
				}
			});
		}
	};

	return (
		<Fragment>
			<Typography color="secondary" align="center" variant="h4">Login</Typography>
			<Grid container direction="column" alignItems="center" justify="center">
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
				<Grid item className={`${classes.loginBtnsItem} ${classes.createAccountItem}`}>
					<Button color="secondary" variant="contained" component={Link} to={"/register"}>register</Button>
				</Grid>
				<Grid item className={classes.loginBtnsItem}>
					<Button color="primary" variant="contained" startIcon={<ExitToAppIcon />} onClick={() => onSubmitLogin()}>
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