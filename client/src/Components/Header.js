import React, { Fragment, useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../Context/AuthContext";
import PropTypes from "prop-types";
import WbSunnyOutlinedIcon from "@material-ui/icons/WbSunnyOutlined";
import Brightness3OutlinedIcon from "@material-ui/icons/Brightness3Outlined";
import ThemeSwitch from "./shared/ThemeSwitch";
import AuthenticatedHeader from "./AuthenticatedHeader";

const useStyles = makeStyles((theme) => ({
	appBar: {
		minHeight: 40
	},
	toolbar: {
		minHeight: 40
	}
}));

const Header = (props) => {
	const classes = useStyles();
	const { isAuthenticated } = useContext(AuthContext);
	const { themeType, toggleDarkTheme } = props;

	const unauthenticatedHeader = () => {
		return (
			<Fragment>
				<Button component={Link} to={"/register"}>register</Button>
				<Button component={Link} to={"/login"}>log in</Button>
			</Fragment>
		);
	};

	return (
		<AppBar color="primary" position="static" className={classes.appBar} id="back-to-top-anchor">
			<Toolbar className={classes.toolbar}>
				<Grid container alignItems="center" justify="flex-end" direction="row">
					<ThemeSwitch checked={themeType === "dark"} onChange={() => toggleDarkTheme()} 
						icon={<WbSunnyOutlinedIcon style={{ color: "yellow" }} />} 
						checkedIcon={<Brightness3OutlinedIcon />}
					/>
					<Button component={Link} to={"/"}>home</Button>
					{isAuthenticated ? <AuthenticatedHeader /> : unauthenticatedHeader()}
				</Grid>
			</Toolbar>
		</AppBar>
	);
};

Header.propTypes = {
	themeType: PropTypes.string.isRequired,
	toggleDarkTheme: PropTypes.func.isRequired
};

export default Header;