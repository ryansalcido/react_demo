import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	footer: {
		height: 30,
		width: "100%",
		bottom: 0,
		position: "absolute",
		backgroundColor: theme.palette.primary.main
	},
	footerText: {
		padding: 3,
		color: "black"
	}
}));

const Footer = () => {
	const classes = useStyles();

	return (
		<footer className={classes.footer}>
			<Grid container alignItems="center" wrap="nowrap" justify="space-around">
				<Grid item zeroMinWidth>
					<Typography variant="body1" title="Ryan's React Project" noWrap className={classes.footerText}>
						{"Ryan's React Project"}
					</Typography>
				</Grid>
				<Grid item zeroMinWidth>
					<Typography variant="body1" title="Created: April 2020" noWrap className={classes.footerText}>
						Created: April 2020
					</Typography>
				</Grid>
			</Grid>
		</footer>
	);
};

export default Footer;