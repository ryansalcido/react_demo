import React, { Fragment, useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import zxcvbn from "zxcvbn";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	passwordStrengthProgress: {
		backgroundColor: "lightgray",
		height: 12,
		borderRadius: 4
	},
	strengthWeak: {
		backgroundColor: "#F25F5C"
	},
	strengthFair: {
		backgroundColor: "#FFE066"
	},
	strengthGood: {
		backgroundColor: "#247BA0"
	},
	strengthStrong: {
		backgroundColor: "green"
	}
}));

const PasswordStrengthMeter = (props) => {
	const classes = useStyles();
	const [ passwordStrength, setPasswordStrength ] = useState({score: 0, label: "Weak"});
	const { password } = props;

	useEffect(() => {
		var result = zxcvbn(password);
		setPasswordStrength({score: result.score, label: calculatePasswordStrength(result.score)});
	}, [ password ]);

	function calculatePasswordStrength(score) {
		switch(score) {
		case 0:
			return "Weak";
		case 1:
			return "Weak";
		case 2:
			return "Fair";
		case 3:
			return "Good";
		case 4:
			return "Strong";
		default:
			return "Weak";
		}
	}

	return (
		<Fragment>
			<LinearProgress className={classes.passwordStrengthProgress} variant="determinate"
				classes={{barColorPrimary : classes[`strength${passwordStrength.label}`]}}
				value={passwordStrength.score * 25} />
			<Typography>
				<strong>Password Strength</strong>: {passwordStrength.label}
			</Typography>
		</Fragment>
	);
};

PasswordStrengthMeter.propTypes = {
	password: PropTypes.string.isRequired
};

export default PasswordStrengthMeter;