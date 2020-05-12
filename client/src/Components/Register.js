import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import CreateIcon from "@material-ui/icons/Create";
import Avatar from "@material-ui/core/Avatar";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import AuthService from "../Services/AuthService";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: 16
	},
	form: {
		paddingTop: theme.spacing(1)
	},
	pwStrengthMeter: {
		padding: "0 12px 12px 12px !important"
	},
	avatar: {
		backgroundColor: "#f50057"
	}
}));

const Register = (props) => {
	const classes = useStyles();

	const requiredError = { msgBody: "This field is required", msgError: true };
	const [ name, setName ] = useState("");
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ showPassword, setShowPassword ] = useState(false);
	const [ errors, setErrors ] = useState({
		name: { msgBody: "", msgError: false},
		email: { msgBody: "", msgError: false},
		password: { msgBody: "", msgError: false}
	});

	const onSubmit = (e) => {
		e.preventDefault();
		if(isFormValid) {
			AuthService.register({name, email, password}).then(data => {
				const { message } = data;
				if(!message.msgError) {
					toast.success("Successfully created account");
					props.history.push("/login");
				} else {
					toast.error("Error creating account. Please try again.");
				}
			});
		} else {
			toast.error("Please fix errors");
		}
	};

	const isFormValid = () => {
		return (name !== "" && !errors.name.msgError) 
			&& (email !== "" && !errors.email.msgError) 
			&& (password !== "" && !errors.password.msgError);
	};

	const validateName = () => {
		setErrors({
			...errors,
			name: /^[\w\-\s]+$/.test(name) ? { msgBody: "", msgError: false} : { msgBody: "Valid characters are A-Z a-z 0-9 _ -", msgError: true }
		});
	};

	const validateEmail = () => {
		const normalized = email.trim().toLowerCase();
		if(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(normalized)) {
			AuthService.validateEmail({email: normalized}).then(data => {
				const { message } = data;
				setErrors({
					...errors,
					email: message.msgError === true ? message : { msgBody: "", msgError: false }
				});
			});
		} else {
			setErrors({
				...errors,
				email: { msgBody: "Invalid email address format", msgError: true }
			});
		}
	};

	const validatePassword = () => {
		setErrors({
			...errors,
			password: password.length < 8 ? { msgBody: "Password must be at least 8 characters", msgError: true } : { msgBody: "", msgError: false}
		});
	};

	return (
		<div className={classes.root}>
			<Typography variant="h4" color="secondary" align="center">Register</Typography>

			<form className={classes.form} onSubmit={onSubmit}>
				<Grid container direction="column" spacing={2}>
					<Grid container item justify="center">
						<Avatar className={classes.avatar}>
							<PersonOutlineOutlinedIcon />
						</Avatar>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3}>
							<TextField value={name} variant="outlined" fullWidth autoFocus required 
								id="name" label="Name" name="name"
								onChange={(event) => setName(event.target.value)} onBlur={() => validateName()}
								error={errors.name.msgError} helperText={errors.name.msgBody}
								InputProps={{ endAdornment: (
									<InputAdornment position="end">
										<IconButton edge="end" onClick={() => {setName(""); setErrors({...errors, name: requiredError}); }}>
											{name !== "" && <ClearIcon />}
										</IconButton>
									</InputAdornment>
								)}} />
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3}>
							<TextField value={email} variant="outlined" fullWidth required 
								id="email" label="Email address" name="email" type="email"
								onChange={(event) => setEmail(event.target.value)} onBlur={() => validateEmail()}
								error={errors.email.msgError} helperText={errors.email.msgBody}
								InputProps={{ endAdornment: (
									<InputAdornment position="end">
										<IconButton edge="end" onClick={() => {setEmail(""); setErrors({...errors, email: requiredError}); }}>
											{email !== "" && <ClearIcon />}
										</IconButton>
									</InputAdornment>
								)}} />
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3}>
							<TextField value={password} variant="outlined" fullWidth required 
								id="password" label="Password" name="email" type={showPassword ? "text" : "password"}
								onChange={(event) => setPassword(event.target.value)} onBlur={() => validatePassword()}
								error={errors.password.msgError} helperText={errors.password.msgBody}
								InputProps={{ endAdornment: (
									<InputAdornment position="end">
										<IconButton edge="end" onClick={() => {setPassword(""); setErrors({...errors, password: requiredError}); }}>
											{password !== "" && <ClearIcon />}
										</IconButton>
										<IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
											{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
										</IconButton>
									</InputAdornment>
								)}} />
						</Grid>
					</Grid>
					<Grid container item justify="center" className={classes.pwStrengthMeter}>
						<Grid item xs={11} sm={7} md={5} lg={3}>
							<PasswordStrengthMeter password={password} />
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3} align="right">
							<Button variant="contained" fullWidth color="primary" type="submit" 
								startIcon={<CreateIcon />} onClick={onSubmit} disabled={!isFormValid()}>
								register
							</Button>
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={6} md={4} lg={2} align="center">
							<Link variant="body2" color="secondary" component="button" onClick={() => {props.history.push("/login");}}>
								{"Already have an account? Sign in"}
							</Link>
						</Grid>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

Register.propTypes = {
	history: PropTypes.object.isRequired
};

export default Register;