import React, { Fragment, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { getUserInitials } from "../utils/StringUtils";

const useStyles = makeStyles((theme) => ({
	profileButton: {
		padding: "6px 8px",
		borderRadius: 4,
		color: "black"
	},
	userAvatar: {
		height: 56,
		width: 56,
		backgroundColor: "#f50057",
		textTransform: "uppercase"
	},
	menuDivider: {
		width: "100%"
	},
	menuButton: {
		padding: "8px 0"
	}
}));

const AuthenticatedHeader = () => {
	const classes = useStyles();

	const { user, manageUserSession } = useContext(AuthContext);
	const [menuAnchorEl, setMenuAnchorEl] = useState(null);

	const onClickLogoutHandler = () => {
		handleClose();
		axios.get("/user/logout").then(res => {
			const { user, success } = res.data;
			if(user && success) {
				manageUserSession(user, false);
			}
		}).catch(error => {
			toast.error("Error occurred attempting to logout");
			manageUserSession({name: "", email: ""}, false);
		});
	};

	const handleClick = (event) => {
		setMenuAnchorEl(event.currentTarget);
	};
	
	const handleClose = () => {
		setMenuAnchorEl(null);
	};

	return (
		<Fragment>
			<Button component={Link} to={"/dashboard"}>Dashboard</Button>
			<IconButton className={classes.profileButton}
				onClick={handleClick}>
				<AccountCircleIcon />
				<ExpandMoreIcon />
			</IconButton>
			<Menu id="simple-menu" anchorEl={menuAnchorEl} keepMounted open={Boolean(menuAnchorEl)} 
				onClose={handleClose} disableScrollLock getContentAnchorEl={null}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left"
				}}
				PaperProps={{
					style: {
						width: 300
					}
				}}
			>
				<Grid container direction="column">
					<Grid container item justify="center">
						<Avatar className={classes.userAvatar}>{getUserInitials(user.name)}</Avatar>
					</Grid>
					<Grid container item justify="center" zeroMinWidth>
						<Typography noWrap variant="h5" title={user.name}>{user.name}</Typography>
					</Grid>
					<Grid container item justify="center" zeroMinWidth>
						<Typography noWrap variant="body2" title={user.email}>{user.email}</Typography>
					</Grid>
					<Divider className={classes.menuDivider} />
					<Grid container item justify="center" className={classes.menuButton}>
						<Button variant="contained" color="primary" 
							component={Link} to={"/profile"} onClick={handleClose}>
							manage profile
						</Button>
					</Grid>
					<Divider className={classes.menuDivider} />
					<Grid container item justify="center" className={classes.menuButton}>
						<Button variant="contained" color="secondary" onClick={onClickLogoutHandler}>logout</Button>
					</Grid>
				</Grid>
			</Menu>
		</Fragment>
	);
};

export default AuthenticatedHeader;