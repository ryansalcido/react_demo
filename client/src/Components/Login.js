import React, { useState, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Link from "@material-ui/core/Link";
import PropTypes from "prop-types";
import { AuthContext } from "../Context/AuthContext";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import AuthService from "../Services/AuthService";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: 16
	},
	form: {
		paddingTop: theme.spacing(3)
	},
	registerButton: {
		"&:hover": {
			textDecoration: "none"
		}
	},
	avatar: {
		backgroundColor: "#f50057"
	}
}));

const Login = (props) => {
	const classes = useStyles();

	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ showPassword, setShowPassword ] = useState(false);
	const authContext = useContext(AuthContext);
	
	const onSubmit = (e) => {
		e.preventDefault();
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
	};

	return (
		<div className={classes.root}>
			<Typography variant="h4" color="secondary" align="center">Login</Typography>
			
			<form className={classes.form} onSubmit={onSubmit}>
				<Grid container direction="column" spacing={3}>
					<Grid container item justify="center">
						<Avatar className={classes.avatar}>
							<LockOutlinedIcon />
						</Avatar>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3}>
							<TextField value={email} variant="outlined" fullWidth autoFocus required 
								id="email" label="Email address" name="email" autoComplete="email" 
								onChange={(event) => setEmail(event.target.value)} 
								InputProps={{ endAdornment: (
									<InputAdornment position="end">
										<IconButton edge="end" onClick={() => setEmail("")}>
											{email !== "" && <ClearIcon />}
										</IconButton>
									</InputAdornment>
								)}} />
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3}>
							<TextField value={password} variant="outlined" fullWidth required id="password" 
								label="Password" name="password" type={showPassword ? "text" : "password"}
								onChange={(event) => setPassword(event.target.value)} 
								InputProps={{ endAdornment: (
									<InputAdornment position="end">
										<IconButton edge="end" onClick={() => setPassword("")}>
											{password !== "" && <ClearIcon />}
										</IconButton>
										<IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
											{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
										</IconButton>
									</InputAdornment>
								)}} 
							/>
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3} align="right">
							<Button variant="contained" fullWidth color="primary" type="submit" 
								startIcon={<ExitToAppIcon />} onClick={onSubmit} disabled={email === "" || password === ""}>
								sign in
							</Button>
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={6} md={4} lg={2} align="center">
							<Link variant="body2" color="secondary" component="button" onClick={() => {props.history.push("/register");}}>
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

Login.propTypes = {
	history: PropTypes.object.isRequired
};

export default Login;