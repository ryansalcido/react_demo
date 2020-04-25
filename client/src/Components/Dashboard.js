import React, { Fragment, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Todo from "./Todo";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";

const Dashboard = () => {
	const [ value, setValue ] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	
	return (
		<Fragment>
			<Typography color="secondary" align="center" variant="h4">Dashboard</Typography>

			<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
				<Tab label="Todos" />
				<Tab label="Weather" />
				<Tab label="Movies" />
			</Tabs>

			<TabPanel value={value} index={0}>
				<Todo />
			</TabPanel>
			<TabPanel value={value} index={1}>
				Weather
			</TabPanel>
			<TabPanel value={value} index={2}>
				Movies
			</TabPanel>
		</Fragment>
	);
};

export default Dashboard;