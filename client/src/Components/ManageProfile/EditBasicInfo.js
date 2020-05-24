import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { AuthContext } from "../../Context/AuthContext";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import clsx from "clsx";
import axios from "axios";
import { useForm, validateEmail, validateName } from "../../hooks/useForm";

const useStyles = makeStyles((theme) => ({
	updateProfileButton: {
		float: "right"
	},
	notAllowedCursor: {
		cursor: "not-allowed"
	}
}));

const EditBasicInfo = () => {
	const classes = useStyles();

	const updateProfile = () => {
		const { name, email} = form;
		if(errors.name.msgError === false && errors.email.msgError === false && isProfileFormValid()) {
			axios.post("/user/updateProfile", {email, name: name.trim()}).then(res => {
				const { user, isAuthenticated, message } = res.data;
				if(isAuthenticated && user) {
					manageUserSession(user, isAuthenticated);
					toast.success(message.msgBody);
				}
			}).catch(error => {
				if(error.response && error.response.status === 401) {
					manageUserSession({name: "", email: ""}, false);
					toast.info("Session has timed out");
				} else {
					toast.error("Unable to update profile. Please try again.");
				}
			});
		} else {
			toast.error("Please fix errors before continuing.");
		}
	};

	const { user, manageUserSession  } = useContext(AuthContext);
	const [form, setForm, handleChange, handleSubmit ] = useForm({name: "", email: ""}, updateProfile);

	const [ errors, setErrors ] = useState({
		name: {msgBody: "", msgError: false},
		email: {msgBody: "", msgError: false}
	});

	//Referencing setForm as a dependency to prevent dependency warning
	//This is okay because the setForm function does not change on re-renders
	useEffect(() => {
		setForm(user);
	}, [user, setForm]);

	const resetProfile = () => {
		setForm({name: user.name, email: user.email});
		setErrors({
			name: {msgBody: "", msgError: false},
			email: {msgBody: "", msgError: false}
		});
	};

	const isProfileFormValid = () => {
		return (form.name !== "" && form.email !== "") && (user.name !== form.name || user.email !== form.email);
	};

	const checkName = (e) => {
		e.preventDefault();
		if(user.name !== form.name && form.name !== "") {
			setErrors(error => ({...error, name: validateName(form.name)}));
		} else if(user.name === form.name) {
			setErrors(error => ({...error, name: {msgBody: "", msgError: false}}));
		}
	};

	const checkEmail = (e) => {
		e.preventDefault();
		if(user.email !== form.email && form.email !== "") {
			validateEmail(form.email).then(data => {
				setErrors(error => ({...error, email: data}));
			}).catch(error => {});
		} else if(user.email === form.email) {
			setErrors({ ...errors, email: {msgBody: "", msgError: false}});
		}
	};

	return (
		<Grid container item spacing={3}>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<TextField value={form.name} id="name" name="name" label="Name" variant="outlined" fullWidth
						onChange={handleChange} onBlur={checkName}
						error={errors.name.msgError} helperText={errors.name.msgBody}
						inputProps={{ maxLength: 26 }} />
				</Grid>
			</Grid>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<TextField value={form.email} id="email" name="email" label="Email Address" fullWidth
						variant="outlined" onChange={handleChange} 
						onBlur={checkEmail}
						error={errors.email.msgError} helperText={errors.email.msgBody} />
				</Grid>
			</Grid>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<span className={clsx(user.name === form.name && user.email === form.email && classes.notAllowedCursor)}>
						<Button size="small" variant="contained" color="secondary" 
							disabled={user.name === form.name && user.email === form.email} onClick={resetProfile}>
							cancel changes
						</Button>
					</span>
					<span className={clsx(classes.updateProfileButton, !isProfileFormValid() && classes.notAllowedCursor)}>
						<Button size="small" variant="contained" color="primary"
							disabled={!isProfileFormValid()} onClick={handleSubmit}>
							update profile
						</Button>
					</span>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default EditBasicInfo;