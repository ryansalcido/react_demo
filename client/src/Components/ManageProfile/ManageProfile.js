import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../shared/TabPanel";
import Grid from "@material-ui/core/Grid";
import BasicInfo from "./EditBasicInfo";
import EditPassword from "./EditPassword";
import AuthService from "../../Services/AuthService";
import { AuthContext } from "../../Context/AuthContext";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
	profileRoot: {
		padding: theme.spacing(2)
	}
}));

const ManageProfile = () => {
	const classes = useStyles();

	const history = useHistory();
	const { setUser, setIsAuthenticated } = useContext(AuthContext);

	const [ value, setValue ] = useState(0);

	const handleLogout = () => {
		AuthService.logout().then(data => {
			if(data.success) {
				toast.info("Session has expired. Please log back in.");
				setUser(data.user);
				setIsAuthenticated(false);
			} else {
				toast.error("Error occurred due to expired sesion.");
			}
			history.push("/login");
		});
	};

	return (
		<div className={classes.profileRoot}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Tabs value={value} onChange={(event, newValue) => setValue(newValue)} centered
						indicatorColor="secondary" textColor="secondary">
						<Tab label="Profile" />
						<Tab label="Password" />
					</Tabs>
				</Grid>
				<Grid item xs={12}>
					<TabPanel value={value} index={0}>
						<BasicInfo handleLogout={handleLogout} />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<EditPassword handleLogout={handleLogout} />
					</TabPanel>
				</Grid>
			</Grid>
		</div>
	);
};

export default ManageProfile;