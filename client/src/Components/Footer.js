import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	footer: {
		height: 30,
		width: "100%",
		clear: "both",
		backgroundColor: theme.palette.primary.main
	},
	footerText: {
		lineHeight: "30px"
	}
}));

const Footer = () => {
	const classes = useStyles();

	return (
		<footer className={classes.footer}>
			<Typography variant="body1" classes={{body1: classes.footerText}}>{"Ryan's React Project"}</Typography>
		</footer>
	);
};

export default Footer;