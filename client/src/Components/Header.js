import React, { Fragment, useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { AuthContext } from "../Context/AuthContext";
import AuthService from "../Services/AuthService";
import Switch from "@material-ui/core/Switch";
import PropTypes from "prop-types";
import WbSunnyOutlinedIcon from "@material-ui/icons/WbSunnyOutlined";
import Brightness3OutlinedIcon from "@material-ui/icons/Brightness3Outlined";

const useStyles = makeStyles((theme) => ({
	toolbar: {
		minHeight: 40
	}
}));

const ThemeSwitch = withStyles((theme) => ({
	root: {
		width: 42,
		height: 26,
		padding: 0,
		margin: "6px 8px",
	},
	switchBase: {
		padding: 1,
		"& + $track": {
			backgroundColor: "lightskyblue",
			opacity: 1,
			border: "none",
		},
		"&$checked": {
			transform: "translateX(16px)",
			color: theme.palette.common.white,
			"& + $track": {
				backgroundColor: "darkslategrey",
				opacity: 1,
				border: "none",
			},
		},
		"&$focusVisible $thumb": {
			color: "#52d869",
			border: "6px solid #fff",
		},
	},
	thumb: {
		width: 24,
		height: 24,
	},
	track: {
		borderRadius: 13,
		border: `1px solid ${theme.palette.grey[400]}`,
		backgroundColor: theme.palette.grey[50],
		opacity: 1,
		transition: theme.transitions.create(["background-color", "border"]),
	},
	checked: {},
	focusVisible: {},
}))(({ classes, ...props }) => {
	return (
		<Switch
			focusVisibleClassName={classes.focusVisible}
			disableRipple
			classes={{
				root: classes.root,
				switchBase: classes.switchBase,
				thumb: classes.thumb,
				track: classes.track,
				checked: classes.checked,
			}}
			{...props}
		/>
	);
});

const Header = (props) => {
	const classes = useStyles();
	const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
	const { themeType, toggleDarkTheme } = props;
	const onClickLogoutHandler = () => {
		AuthService.logout().then(data => {
			if(data.success) {
				setUser(data.user);
				setIsAuthenticated(false);
			}
		});
	};

	return (
		<Fragment>
			<AppBar color="primary" position="static">
				<Toolbar className={classes.toolbar}>
					<Grid container alignItems="flex-start" justify="flex-end" direction="row">
						<ThemeSwitch checked={themeType === "dark"} onChange={() => toggleDarkTheme()} 
							icon={<WbSunnyOutlinedIcon style={{ color: "yellow" }} />} 
							checkedIcon={<Brightness3OutlinedIcon />}
						/>
						{isAuthenticated
							? <Button component={Link} to={"/"} onClick={onClickLogoutHandler}>logout</Button>
							: <Fragment>
								<Button component={Link} to={"/register"}>register</Button>
								<Button component={Link} to={"/login"}>sign in</Button>
							</Fragment>
						}
					</Grid>
				</Toolbar>
			</AppBar>
		</Fragment>
	);
};

Header.propTypes = {
	themeType: PropTypes.string.isRequired,
	toggleDarkTheme: PropTypes.func.isRequired
};

export default Header;