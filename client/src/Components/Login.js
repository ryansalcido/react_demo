import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Link from "@material-ui/core/Link";
import { AuthContext } from "../Context/AuthContext";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useForm } from "../hooks/useForm";

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

const Login = () => {
	const classes = useStyles();

	const loginUser = () => {
		const { email, password } = form;
		axios.post("/user/login", {email, password}).then(res => {
			const { isAuthenticated, user } = res.data;
			if(isAuthenticated) {
				manageUserSession(user, isAuthenticated);
				toast.success(`${user.name} has successfully logged in!`);
				history.push("/dashboard");
			}
		}).catch(error => {
			toast.error("Invalid username or password");
			setForm({email: "", password: ""});
		});
	};

	const history = useHistory();
	const { manageUserSession } = useContext(AuthContext);
	const [ form, setForm, handleChange, handleSubmit ] = 
		useForm({email: "", password: "", showPassword: false}, loginUser);

	return (
		<div className={classes.root}>
			<Typography variant="h4" color="secondary" align="center">Login</Typography>
			
			<form className={classes.form} onSubmit={handleSubmit}>
				<Grid container direction="column" spacing={3}>
					<Grid container item justify="center">
						<Avatar className={classes.avatar}>
							<LockOutlinedIcon />
						</Avatar>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3}>
							<TextField value={form.email} variant="outlined" fullWidth autoFocus required 
								id="email" label="Email address" name="email" autoComplete="email" 
								onChange={handleChange} 
								InputProps={{ endAdornment: (
									<InputAdornment position="end">
										<IconButton edge="end" onClick={() => setForm(form => ({...form, email: ""}))}>
											{form.email !== "" && <ClearIcon />}
										</IconButton>
									</InputAdornment>
								)}} />
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3}>
							<TextField value={form.password} variant="outlined" fullWidth required id="password" 
								label="Password" name="password" type={form.showPassword ? "text" : "password"}
								onChange={handleChange} 
								InputProps={{ endAdornment: (
									<InputAdornment position="end">
										<IconButton edge="end" onClick={() => setForm(form => ({...form, password: ""}))}>
											{form.password !== "" && <ClearIcon />}
										</IconButton>
										<IconButton edge="end" name="showPassword" onClick={() => setForm(form => ({...form, "showPassword": !form.showPassword}))}>
											{form.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
										</IconButton>
									</InputAdornment>
								)}} 
							/>
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3} align="right">
							<Button variant="contained" fullWidth color="primary" type="submit" 
								startIcon={<ExitToAppIcon />} onClick={handleSubmit} 
								disabled={form.email === "" || form.password === ""}>
								sign in
							</Button>
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={6} md={4} lg={2} align="center">
							<Link variant="body2" color="secondary" component="button" onClick={() => {history.push("/register");}}>
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

export default Login;