import React, { Fragment, useState, useEffect } from "react";
import Todo from "./Todo";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import Weather from "./Weather";

const Dashboard = () => {
	const [ value, setValue ] = useState(0);
	const [ isLoading, setIsLoading ] = useState(true);

	const handleChange = (event, newValue) => {
		setValue(newValue);
		localStorage.setItem("selectedTab", newValue);
	};

	useEffect(() => {
		setIsLoading(true);
		if(localStorage.getItem("selectedTab")) {
			setValue(parseInt(localStorage.getItem("selectedTab")));
		}
		setIsLoading(false);
	}, []);

	return (
		<Fragment>
			<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
				<Tab label="Todos" />
				<Tab label="Weather" />
			</Tabs>

			{!isLoading && <Fragment>
				<TabPanel value={value} index={0}>
					<Todo />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Weather />
				</TabPanel>
			</Fragment>}

		</Fragment>
	);
};

export default Dashboard;