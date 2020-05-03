import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	footer: {
		height: 30,
		width: "100%",
		bottom: 0,
		position: "absolute",
		backgroundColor: theme.palette.primary.main
	},
	footerMain: {
		display: "flex",
		color: "black",
		justifyContent: "space-around",
		height: 30
	},
	footerText: {
		padding: 3
	}
}));

const Footer = () => {
	const classes = useStyles();

	return (
		<footer className={classes.footer}>
			<div className={classes.footerMain}>
				<Typography variant="body1" className={classes.footerText}>{"Ryan's React Project"}</Typography>
				<Typography variant="body1" className={classes.footerText}>Created: April 2020</Typography>
			</div>
		</footer>
	);
};

export default Footer;