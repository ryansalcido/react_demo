import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import SpotifyExplorer from "./SpotifyExplorer";
import SpotifyContentView from "./SpotifyContentView";

const useStyles = makeStyles((theme) => ({
	root: {
		height: 450
	},
	explorerView: {
		borderRight: `1px solid ${theme.palette.divider}`
	}
}));

const SpotifyContainer = () => {
	const classes = useStyles();

	return (
		<Paper elevation={4} className={classes.root}>
			<Grid container style={{height: "inherit"}}>
				<Grid item xs={4} sm={3} md={2} className={classes.explorerView}>
					<SpotifyExplorer />
				</Grid>
				<Grid item xs={8} sm={9} md={10}>
					<SpotifyContentView />
				</Grid>
			</Grid>
		</Paper>
	);
};

export default SpotifyContainer;