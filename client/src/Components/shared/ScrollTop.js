import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import PropTypes from "prop-types";
import Zoom from "@material-ui/core/Zoom";

const useStyles = makeStyles((theme) => ({
	fabRoot: {
		position: "fixed",
		bottom: theme.spacing(6),
		right: theme.spacing(2)
	}
}));

const ScrollTop = (props) => {
	const { children } = props;
	const classes = useStyles();
	
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 100
	});

	const handleClick = (event) => {
		const anchor = (event.target.ownerDocument || document).querySelector("#back-to-top-anchor");

		if (anchor) {
			anchor.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	return (
		<Zoom in={trigger}>
			<div onClick={handleClick} role="presentation" className={classes.fabRoot}>
				{children}
			</div>
		</Zoom>
	);
};

ScrollTop.propTypes = {
	children: PropTypes.element.isRequired
};

export default ScrollTop;