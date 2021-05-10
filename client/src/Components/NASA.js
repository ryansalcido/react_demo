import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAmericas } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	pictureTitle: {
		textTransform: "uppercase"
	},
	nasaGridItem: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	nasaImage: {
		width: "inherit",
		maxHeight: 400
	}
}));

const NASA = (props) => {
	const classes = useStyles();
	const { nasaResult } = props;

	return (
		<Fragment>
			<Grid item xs={12}>
				<Typography align="left" variant="h5" color="error">{"NASA's Picture of the Day"}</Typography>
			</Grid>							
			<Grid item xs={12} md={5} className={classes.nasaGridItem}>
				{nasaResult.hdurl || nasaResult.url
					? <img className={classes.nasaImage} src={nasaResult.hdurl || nasaResult.url} 
						alt={nasaResult.title} />
					: <FontAwesomeIcon icon={faGlobeAmericas} size="10x" />
				}
			</Grid>
			<Grid item xs={12} md={7}>
				<Typography variant="h5" align="center" color="primary" className={classes.pictureTitle}>
					{nasaResult.title}
				</Typography>
				<Typography variant="subtitle1">Date: {nasaResult.date}</Typography>
				<Typography variant="body1">{nasaResult.explanation}</Typography>
			</Grid>
		</Fragment>
	);
};

NASA.propTypes = {
	nasaResult: PropTypes.object.isRequired
};

export default NASA;