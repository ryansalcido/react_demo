import React, { Fragment } from "react";
import Todo from "./Todo/TodoView";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./shared/TabPanel";
import Weather from "./Weather/Weather";
import Spotify from "./Spotify/Spotify";
import Pokemon from "./Pokemon/Pokemon";
import SpotifyProvider from "../Context/SpotifyContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

const Dashboard = () => {
	const [ value, setValue ] = useLocalStorage("selectedTab", 0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Fragment>
			<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
				<Tab label="Todos" />
				<Tab label="Weather" />
				<Tab label="Music" />
				<Tab label="Pokemon" />
			</Tabs>

			<Fragment>
				<TabPanel value={value} index={0}>
					<Todo />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Weather />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<SpotifyProvider>
						<Spotify />
					</SpotifyProvider>
				</TabPanel>
				<TabPanel value={value} index={3}>
					<Pokemon />
				</TabPanel>
			</Fragment>

		</Fragment>
	);
};

export default Dashboard;