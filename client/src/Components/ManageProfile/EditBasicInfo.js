import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AuthService from "../../Services/AuthService";
import { AuthContext } from "../../Context/AuthContext";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import clsx from "clsx";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	updateProfileButton: {
		float: "right"
	},
	notAllowedCursor: {
		cursor: "not-allowed"
	}
}));

const EditBasicInfo = (props) => {
	const classes = useStyles();

	const { handleLogout } = props;
	const { user, setUser, setIsAuthenticated } = useContext(AuthContext);

	const [ name, setName ] = useState("");
	const [ email, setEmail ] = useState("");
	const [ errors, setErrors ] = useState({
		name: {msgBody: "", msgError: false},
		email: {msgBody: "", msgError: false}
	});

	useEffect(() => {
		setName(user.name);
		setEmail(user.email);
	}, [user]);

	const resetProfile = () => {
		setName(user.name);
		setEmail(user.email);
		setErrors({
			name: {msgBody: "", msgError: false},
			email: {msgBody: "", msgError: false}
		});
	};

	const isProfileFormValid = () => {
		return (name !== "" && email !== "") && (user.name !== name || user.email !== email);
	};

	const updateProfile = () => {
		if(errors.name.msgError === false && errors.email.msgError === false && isProfileFormValid()) {
			AuthService.updateProfile({email, name: name.trim()}).then(data => {
				const { user, isAuthenticated, message } = data;
				if(isAuthenticated === false) {
					handleLogout();
				} else if(message.msgError === false) {
					setUser(user);
					setIsAuthenticated(isAuthenticated);
					toast.success(message.msgBody);
				} else {
					toast.error("Unable to update profile. Please try again.");
				}
				
			});
		} else {
			toast.error("Please fix errors before continuing.");
		}
	};

	const validateName = (e) => {
		e.preventDefault();
		if(user.name !== name && name !== "") {
			setErrors({
				...errors,
				name: /^[\w\-\s]+$/.test(name)
					? { msgBody: "", msgError: false} 
					: { msgBody: "Valid characters are A-Z a-z 0-9 _ -", msgError: true }
			});
		} else if(user.name === name) {
			setErrors({ ...errors, name: {msgBody: "", msgError: false}});
		}
	};

	const validateEmail = (e) => {
		e.preventDefault();
		if(user.email !== email && email !== "") {
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
		} else if(user.email === email) {
			setErrors({ ...errors, email: {msgBody: "", msgError: false}});
		}
	};

	return (
		<Grid container item spacing={3}>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<TextField value={name} id="name" name="name" label="Name" variant="outlined" fullWidth
						onChange={(event) => setName(event.target.value)} onBlur={validateName}
						error={errors.name.msgError} helperText={errors.name.msgBody}
						inputProps={{ maxLength: 26 }} />
				</Grid>
			</Grid>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<TextField value={email} id="email" name="email" label="Email Address" fullWidth
						variant="outlined" onChange={(event) => setEmail(event.target.value)} 
						onBlur={validateEmail}
						error={errors.email.msgError} helperText={errors.email.msgBody} />
				</Grid>
			</Grid>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<span className={clsx(user.name === name && user.email === email && classes.notAllowedCursor)}>
						<Button size="small" variant="contained" color="secondary" 
							disabled={user.name === name && user.email === email} onClick={resetProfile}>
							cancel changes
						</Button>
					</span>
					<span className={clsx(classes.updateProfileButton, !isProfileFormValid() && classes.notAllowedCursor)}>
						<Button size="small" variant="contained" color="primary"
							disabled={!isProfileFormValid()} onClick={updateProfile}>
							update profile
						</Button>
					</span>
				</Grid>
			</Grid>
		</Grid>
	);
};

EditBasicInfo.propTypes = {
	handleLogout: PropTypes.func
};

EditBasicInfo.defaultProps = {
	handleLogout: () => {}
};

export default EditBasicInfo;