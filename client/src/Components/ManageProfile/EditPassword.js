import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { AuthContext } from "../../Context/AuthContext";
import clsx from "clsx";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useForm } from "../../hooks/useForm";

const useStyles = makeStyles((theme) => ({
	changePasswordButton: {
		float: "right"
	},
	notAllowedCursor: {
		cursor: "not-allowed"
	}
}));

const EditPassword = () => {
	const classes = useStyles();

	const changePassword = () => {
		if(isFormValid()) {
			const { originalPassword, newPassword } = form;
			axiosInstance.post("user/changePassword", {originalPassword, newPassword}).then(res => {
				const { message } = res.data;
				setMessage(message);
				setForm({originalPassword: "", newPassword: "", showPassword: false});
			}).catch(error => {
				if(error.response) {
					const { status, data } = error.response;
					if(status === 401) {
						manageUserSession({name: "", email: ""}, false);
						toast.info("Session has timed out");
					} else if(data && data.message) {
						setMessage(data.message);
					}
				}
			});
		}
	};

	const { manageUserSession } = useContext(AuthContext);
	const [ form, setForm, handleChange, handleSubmit ] =
		useForm({originalPassword: "", newPassword: "", showPassword: false}, changePassword);
	const [ message, setMessage ] = useState({msgBody: "", msgError: false});

	const isFormValid = () => {
		return form.originalPassword !== "" && form.newPassword !== "" && form.newPassword.length >= 8;
	};

	const resetForm = () => {
		setMessage({msgBody: "", msgError: false});
		setForm({originalPassword: "", newPassword: "", showPassword: false});
	};

	return (
		<Grid container item spacing={2} justify="center">
			<Grid item xs={12}>
				<Typography variant="h6" align="center" color={message.msgError === false ? "primary" : "error"}>
					{message.msgBody}
				</Typography>
			</Grid>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<TextField value={form.originalPassword} id="originalPassword" name="originalPassword" label="Original Password" variant="outlined"
						fullWidth type={form.showPassword ? "text" : "password"}
						onChange={handleChange}
						InputProps={{ endAdornment: (
							<InputAdornment position="end">
								<IconButton edge="end" onClick={() => setForm(form => ({...form, "showPassword": !form.showPassword}))}>
									{form.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
								</IconButton>
							</InputAdornment>
						)}} />
				</Grid>
			</Grid>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<TextField value={form.newPassword} id="newPassword" name="newPassword" label="New Password" variant="outlined"
						fullWidth type={form.showPassword ? "text" : "password"}
						onChange={handleChange}
						helperText="Password must be at least 8 characters"
						InputProps={{ endAdornment: (
							<InputAdornment position="end">
								<IconButton edge="end" onClick={() => setForm(form => ({...form, "showPassword": !form.showPassword}))}>
									{form.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
								</IconButton>
							</InputAdornment>
						)}} />
				</Grid>
			</Grid>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<span className={clsx(form.originalPassword === ""  && form.newPassword === "" && classes.notAllowedCursor)}>
						<Button size="small" variant="contained" color="secondary" 
							disabled={form.originalPassword === "" && form.newPassword === ""} onClick={resetForm}>
							cancel changes
						</Button>
					</span>
					<span className={clsx(classes.changePasswordButton, !isFormValid() && classes.notAllowedCursor)}>
						<Button size="small" fullWidth color="primary" variant="contained" 
							onClick={handleSubmit} disabled={!isFormValid()}>
							change password
						</Button>
					</span>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default EditPassword;