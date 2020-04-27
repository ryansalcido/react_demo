import React, { Fragment, useState } from "react";
import Todo from "./Todo";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import Weather from "./Weather";

const Dashboard = () => {
	const [ value, setValue ] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	
	return (
		<Fragment>
			<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
				<Tab label="Todos" />
				<Tab label="Weather" />
			</Tabs>

			<TabPanel value={value} index={0}>
				<Todo />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<Weather />
			</TabPanel>
		</Fragment>
	);
};

export default Dashboard;