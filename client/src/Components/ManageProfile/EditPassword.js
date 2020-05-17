import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AuthService from "../../Services/AuthService";
import clsx from "clsx";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	changePasswordButton: {
		float: "right"
	},
	notAllowedCursor: {
		cursor: "not-allowed"
	}
}));

const EditPassword = (props) => {
	const classes = useStyles();

	const { handleLogout } = props;

	const [ originalPassword, setOriginalPassword ] = useState("");
	const [ showPassword, setShowPassword ] = useState(false);
	const [ message, setMessage ] = useState({msgBody: "", msgError: false});
	const [ newPassword, setNewPassword ] = useState("");

	const changePassword = () => {
		if(isFormValid()) {
			AuthService.changePassword({originalPassword, newPassword}).then(data => {
				const { isAuthenticated, message } = data;
				if(isAuthenticated === false) {
					handleLogout();
				} else {
					setMessage(message);
					if(message.msgError === false) {
						setOriginalPassword("");
						setNewPassword("");
					}
				}
			});
		}
	};

	const isFormValid = () => {
		return originalPassword !== "" && newPassword !== "" && newPassword.length >= 8;
	};

	const cancelChanges = () => {
		setOriginalPassword("");
		setNewPassword("");
		setMessage("");
	};

	return (
		<Grid container item spacing={2} justify="center">
			<Grid item xs={12}>
				{message.msgError === false 
					? <Typography variant="h6" align="center" color="primary">{message.msgBody}</Typography>
					: <Typography variant="h6" align="center" color="error">{message.msgBody}</Typography>
				}
			</Grid>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<TextField value={originalPassword} id="originalPassword" name="originalPassword" label="Original Password" variant="outlined"
						fullWidth type={showPassword ? "text" : "password"}
						onChange={(event) => setOriginalPassword(event.target.value)}
						InputProps={{ endAdornment: (
							<InputAdornment position="end">
								<IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
								</IconButton>
							</InputAdornment>
						)}} />
				</Grid>
			</Grid>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<TextField value={newPassword} id="newPassword" name="newPassword" label="New Password" variant="outlined"
						fullWidth type={showPassword ? "text" : "password"}
						onChange={(event) => setNewPassword(event.target.value)}
						helperText="Password must be at least 8 characters"
						InputProps={{ endAdornment: (
							<InputAdornment position="end">
								<IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
								</IconButton>
							</InputAdornment>
						)}} />
				</Grid>
			</Grid>
			<Grid container item justify="center">
				<Grid item xs={11} sm={7} md={5} lg={3}>
					<span className={clsx(originalPassword === ""  && newPassword === "" && classes.notAllowedCursor)}>
						<Button size="small" variant="contained" color="secondary" 
							disabled={originalPassword === "" && newPassword === ""} onClick={cancelChanges}>
							cancel changes
						</Button>
					</span>
					<span className={clsx(classes.changePasswordButton, !isFormValid() && classes.notAllowedCursor)}>
						<Button size="small" fullWidth color="primary" variant="contained" 
							onClick={changePassword} disabled={!isFormValid()}>
							change password
						</Button>
					</span>
				</Grid>
			</Grid>
		</Grid>
	);
};

EditPassword.propTypes = {
	handleLogout: PropTypes.func
};

EditPassword.defaultProps = { 
	handleLogout: () => {}
};

export default EditPassword;