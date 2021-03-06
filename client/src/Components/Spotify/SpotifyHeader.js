import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { SpotifyContext } from "../../Context/SpotifyContext"; 

const useStyles = makeStyles((theme) => ({
	spotifyHeader: {
		height: 36,
		padding: "0 16px"
	}
}));

const SpotifyHeader = () => {
	const classes = useStyles();
	const { profile } = useContext(SpotifyContext);

	return (
		<div className={classes.spotifyHeader}>
			<Grid container alignItems="center" justify="flex-end">
				<Grid item>
					<Typography variant="body1" align="right">{profile.display_name}</Typography>
				</Grid>
			</Grid>
		</div>
	);
};

export default SpotifyHeader;