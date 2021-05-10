import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { SpotifyContext } from "../../Context/SpotifyContext";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
	errorViewRoot: {
		padding: theme.spacing(2)
	}
}));

const SpotifyErrorView = () => {
	const classes = useStyles();
	const { error } = useContext(SpotifyContext);

	const { message } = error && error.response && error.response.data;
	return (
		<div className={classes.errorViewRoot}>
			<Typography variant="h6" align="center" color="error">
				{message ? message.msgBody : "Oops, something went wrong. Please try again."}
			</Typography>
		</div>
	);
};

export default SpotifyErrorView;