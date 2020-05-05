import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import InputBase from "@material-ui/core/InputBase";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
	spotifyHeader: {
		height: 36,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "0 16px"
	}
}));

const SpotifyHeader = () => {
	const classes = useStyles();
	const profile = useSelector(state => state.profile);

	return (
		<div className={classes.spotifyHeader}>
			<InputBase placeholder="Search..." />
			<Typography variant="body1" align="right">{profile.display_name}</Typography>
		</div>
	);
};

export default SpotifyHeader;