import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../shared/TabPanel";
import Grid from "@material-ui/core/Grid";
import BasicInfo from "./EditBasicInfo";
import EditPassword from "./EditPassword";

const useStyles = makeStyles((theme) => ({
	profileRoot: {
		padding: theme.spacing(2)
	}
}));

const ManageProfile = () => {
	const classes = useStyles();

	const [ value, setValue ] = useState(0);

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
						<BasicInfo />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<EditPassword />
					</TabPanel>
				</Grid>
			</Grid>
		</div>
	);
};

export default ManageProfile;