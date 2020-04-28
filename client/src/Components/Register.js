import React, { Fragment, useState, useEffect, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from "@material-ui/icons/Clear";
import CreateIcon from "@material-ui/icons/Create";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import useDebounce from "../utils/useDebounce";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import AuthService from "../Services/AuthService";
import Message from "./Message";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	success: {
		color: "green"
	},
	error: {
		color: "red"
	},
	gridItem: {
		paddingTop: 20,
		width: "100%",
		textAlign: "center"
	},
	messageItem: {
		display: "flex",
		justifyContent: "center"
	},
	registerBtnsItem: {
		paddingTop: 20
	},
	cancelItem: {
		paddingRight: 60
	},
	passwordStrengthItem: {
		paddingTop: 10,
		width: "30%"
	}
}));

const Register = (props) => {
	const classes = useStyles();
	const [ name, setName ] = useState("");
	const [ nameError, setNameError ] = useState({msgBody: "", msgError: false});
	const [ email, setEmail ] = useState("");
	const [ emailError, setEmailError ] = useState({msgBody: "", msgError: false});
	const [ password, setPassword ] = useState("");
	const [ showPassword, setShowPassword ] = useState(false);
	const [ passwordError, setPasswordError ] = useState({msgBody: "", msgError: false});
	const [ message, setMessage ] = useState({msgBody: "", msgError: false});
	let timerID = useRef(null);

	useEffect(() => {
		return () => {
			clearTimeout(timerID);
		};
	}, []);

	const debouncedEmail = useDebounce(email, 500);
	const debouncedPassword = useDebounce(password, 500);

	useEffect(() => {
		if(debouncedEmail) {
			const normalizedEmail = debouncedEmail.trim().toLowerCase();
			if(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(normalizedEmail)) {
				AuthService.validateEmail({email: debouncedEmail}).then(data => {
					const { message } = data;
					if(message.msgError === true) {
						setEmailError(message);
					} else {
						setEmailError({msgBody: "", msgError: false});
					}
				});
			} else {
				setEmailError({msgBody: "Invalid email address format", msgError: true});
			}
		}
	}, [debouncedEmail]);

	useEffect(() => {
		if(debouncedPassword) {
			if(debouncedPassword.length < 8) {
				setPasswordError({msgBody: "Password must be at least 8 characters", msgError: true});
			}
		}
	}, [debouncedPassword]);

	function createUser() {
		if(name === "" || email === "" || password === "") {
			if(name === "") {
				setNameError({msgBody: "This is a required field", msgError: true});
			}
			if(email === "") {
				setEmailError({msgBody: "This is a required field", msgError: true});
			}
			if(password === "") {
				setPasswordError({msgBody: "This is a required field", msgError: true});
			}
		} else if(nameError.msgError === false && emailError.msgError === false && passwordError.msgError === false) {
			AuthService.register({ name, email, password }).then(data => {
				const { message } = data;
				setMessage(message);
				if(!message.msgError) {
					timerID = setTimeout(() => {
						props.history.push("/login");
					}, 2000);
				}
			});
		}
	}

	return (
		<Fragment>
			<Typography color="secondary" align="center" variant="h4">Register</Typography>

			<Grid container direction="column" alignItems="center" justify="center">
				<Grid item className={`${classes.gridItem} ${classes.messageItem}`}>
					<Message width="45%" message={message} setMessage={setMessage} />
				</Grid>
				<Grid item className={classes.gridItem}>
					<TextField color="secondary" value={name} name="name" required label="Name"
						variant="outlined" inputProps={{maxLength: 38}} 
						onChange={(event) => {setName(event.target.value);setNameError({msgBody: "", msgError: false});}}
						error={nameError.msgError} helperText={nameError.msgBody}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton edge="end"
										onClick={() => {setName(""); setNameError({msgBody: "This is a required field", msgError: true});}}>
										{name !== "" && <ClearIcon />}
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
				</Grid>

				<Grid item className={classes.gridItem}>
					<TextField value={email} color="secondary" name="email" 
						variant="outlined" required label="Email"
						onChange={(event) => setEmail(event.target.value)}
						error={emailError.msgError} helperText={emailError.msgBody}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton edge="end" 
										onClick={() => {setEmail(""); setEmailError({msgBody: "This is a required field", msgError: true});}}>
										{email !== "" && <ClearIcon />}
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
				</Grid>

				<Grid item className={classes.gridItem}>
					<TextField color="secondary" value={password} label="Password" required
						name="password" type={showPassword ? "text" : "password"} variant="outlined"
						onChange={(event) => {setPassword(event.target.value); setPasswordError({msgBody: "", msgError: false});}}
						error={passwordError.msgError} helperText={passwordError.msgBody}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton edge="end" 
										onClick={() => {setPassword(""); setPasswordError({msgBody: "This is a required field", msgError: true});}}>
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
				<Grid item className={classes.passwordStrengthItem}>
					<PasswordStrengthMeter password={password} />
				</Grid>
			</Grid>

			<Grid container direction="row" alignItems="center" justify="center">
				<Grid item className={`${classes.registerBtnsItem} ${classes.cancelItem}`}>
					<Button variant="contained" color="secondary" 
						startIcon={<CancelIcon />} component={Link} to={"/"}>
            cancel
					</Button>
				</Grid>
				<Grid item className={classes.registerBtnsItem}>
					<Button variant="contained" color="primary" startIcon={<CreateIcon />}
						onClick={() => createUser()}>
            create
					</Button>
				</Grid>
			</Grid>        
		</Fragment>
	);
};

Register.propTypes = {
	history: PropTypes.object.isRequired
};

export default Register;