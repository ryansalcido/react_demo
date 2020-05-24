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
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useForm, validateEmail, validateName } from "../hooks/useForm";

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

const Register = () => {
	const classes = useStyles();

	const registerUser = () => {
		if(isFormValid) {
			const { name, email, password } = form;
			axios.post("/user/register", {name, email, password}).then(res => {
				const { message } = res.data;
				if(message && message.msgError === false) {
					toast.success("Successfully created account");
					history.push("/login");
				}
			}).catch(error => {
				toast.error("Error creating account. Please try again.");	
			});
		} else {
			toast.error("Please fix errors");
		}
	};

	const history = useHistory();
	const [ form, setForm, handleChange, handleSubmit ] = 
		useForm({name: "", email: "", password: "", showPassword: false}, registerUser);

	const [ errors, setErrors ] = useState({
		name: { msgBody: "", msgError: false},
		email: { msgBody: "", msgError: false},
		password: { msgBody: "", msgError: false}
	});

	const isFormValid = () => {
		return (form.name !== "" && !errors.name.msgError) 
			&& (form.email !== "" && !errors.email.msgError) 
			&& (form.password !== "" && !errors.password.msgError);
	};

	const checkName = () => {
		setErrors(error => ({...error, name: validateName(form.name)}));
	};

	const checkEmail = () => {
		validateEmail(form.email).then(data => {
			setErrors(error => ({...error, email: data}));
		}).catch(error => {});
	};

	const validatePassword = () => {
		setErrors(error => ({
			...error, 
			password: form.password.length < 8
				? { msgBody: "Password must be at least 8 characters", msgError: true } 
				: { msgBody: "", msgError: false}}));
	};

	return (
		<div className={classes.root}>
			<Typography variant="h4" color="secondary" align="center">Register</Typography>

			<form className={classes.form} onSubmit={handleSubmit}>
				<Grid container direction="column" spacing={2}>
					<Grid container item justify="center">
						<Avatar className={classes.avatar}>
							<PersonOutlineOutlinedIcon />
						</Avatar>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3}>
							<TextField value={form.name} variant="outlined" fullWidth autoFocus required 
								id="name" label="Name" name="name" onChange={handleChange} onBlur={checkName}
								error={errors.name.msgError} helperText={errors.name.msgBody}
								InputProps={{ endAdornment: (
									<InputAdornment position="end">
										<IconButton edge="end" onClick={() => setForm(form => ({...form, name: ""}))}>
											{form.name !== "" && <ClearIcon />}
										</IconButton>
									</InputAdornment>
								)}} />
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3}>
							<TextField value={form.email} variant="outlined" fullWidth required  onBlur={checkEmail}
								id="email" label="Email address" name="email" type="email" onChange={handleChange}
								error={errors.email.msgError} helperText={errors.email.msgBody}
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
							<TextField value={form.password} variant="outlined" fullWidth required onChange={handleChange}
								id="password" label="Password" name="password" type={form.showPassword ? "text" : "password"}
								error={errors.password.msgError} helperText={errors.password.msgBody} onBlur={validatePassword}
								InputProps={{ endAdornment: (
									<InputAdornment position="end">
										<IconButton edge="end" onClick={() => setForm(form => ({...form, password: ""}))}>
											{form.password !== "" && <ClearIcon />}
										</IconButton>
										<IconButton edge="end" onClick={() => setForm(form => ({...form, "showPassword": !form.showPassword}))}>
											{form.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
										</IconButton>
									</InputAdornment>
								)}} />
						</Grid>
					</Grid>
					<Grid container item justify="center" className={classes.pwStrengthMeter}>
						<Grid item xs={11} sm={7} md={5} lg={3}>
							<PasswordStrengthMeter password={form.password} />
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={11} sm={7} md={5} lg={3} align="right">
							<Button variant="contained" fullWidth color="primary" type="submit" disabled={!isFormValid()}
								startIcon={<CreateIcon />} onClick={handleSubmit}> 
								register
							</Button>
						</Grid>
					</Grid>
					<Grid container item justify="center">
						<Grid item xs={6} md={4} lg={2} align="center">
							<Link variant="body2" color="secondary" component="button" onClick={() => {history.push("/login");}}>
								{"Already have an account? Sign in"}
							</Link>
						</Grid>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

export default Register;