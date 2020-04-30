import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		textAlign: "center"
	},
	homeButton: {
		marginTop: 20
	}
}));

const NotFound = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Typography variant="h1">Oops!</Typography>
			<Typography variant="h1">404</Typography>
			<Typography variant="h4">Page not found</Typography>
			<Button className={classes.homeButton} size="large" color="secondary" 
				variant="contained" component={Link} to={"/"}>
				homepage
			</Button>
		</div>
	);
};

export default NotFound;