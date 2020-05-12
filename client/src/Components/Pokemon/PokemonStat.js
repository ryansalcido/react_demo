import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import { toProperCase } from "../../utils/StringUtils";

const useStyles = makeStyles((theme) => ({
	statProgressBar: {
		height: 14,
		borderRadius: 4
	}
}));

const PokemonStat = (props) => {
	const { stats } = props;
	const classes = useStyles();

	const abbreviateStatName = (name) => {
		if(name === "special-defense") {
			return "Sp. Def";
		} else if(name === "special-attack") {
			return "Sp. Atk";
		} else {
			return toProperCase(name);
		}
	};

	return (
		<Fragment>
			{stats.map((stat, idx) => {
				return (
					<Grid container item key={stat.stat.name} alignItems="center" spacing={1}>
						<Grid item xs={4}>
							<Typography variant="body1">{abbreviateStatName(stat.stat.name)}</Typography>
						</Grid>
						<Grid item xs={6}>
							<LinearProgress className={classes.statProgressBar} variant="determinate" color="secondary" 
								value={Math.min(100, stat.base_stat)} />
						</Grid>
						<Grid item xs={2}>
							<Typography variant="body1">{stat.base_stat}</Typography>
						</Grid>
					</Grid>
				);
			})}
		</Fragment>
	);
};

PokemonStat.propTypes = {
	stats: PropTypes.array.isRequired
};

export default PokemonStat;