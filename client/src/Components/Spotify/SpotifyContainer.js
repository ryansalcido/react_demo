import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import SpotifyExplorer from "./SpotifyExplorer";
import SpotifyContentView from "./SpotifyContentView";

const useStyles = makeStyles((theme) => ({
	spotifyContainer: {
		width: "100%",
		height: "445px",
		padding: 5
	},
	explorerPanel: {
		width: "15%",
		height: "100%",
		borderRight: `1px solid ${theme.palette.divider}`
	},
	contentViewPanel: {
		width: "85%",
		height: "100%"
	}
}));

const SpotifyContainer = () => {
	const classes = useStyles();

	return (
		<Paper elevation={4}>
			<Grid container direction="row" className={classes.spotifyContainer}>
				<Grid item className={classes.explorerPanel}>
					<SpotifyExplorer />
				</Grid>
				<Grid item className={classes.contentViewPanel}>
					<SpotifyContentView />
				</Grid>
			</Grid>
		</Paper>
	);
};

export default SpotifyContainer;