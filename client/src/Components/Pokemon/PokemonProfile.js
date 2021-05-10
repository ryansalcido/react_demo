import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { toProperCase } from "../../utils/StringUtils";

const calculateFemaleRatio = (femaleRatio) => {
	if(femaleRatio === -1) {
		return "No gender";
	} else {
		return Math.round(12.5 * femaleRatio);
	}
};

const calculateWeight = (weight) => {
	return (weight / 4.536).toFixed(2);
};

const calculateHeight = (height) => {
	return (height / 3.048).toFixed(2);
};

const calculateCaptureRate = (captureRate) => {
	return Math.round((100 / 255) * captureRate);
};

const formatAbilities = (abilities) => {
	return abilities.map(a => toProperCase(a.ability.name)).join(", ");
};

const calculateHatchSteps = (hatchSteps) => {
	return 255 * (hatchSteps + 1);
};

const formatEggGroups = (eggGroups) => {
	return eggGroups ? eggGroups.map(e => toProperCase(e.name)).join(", ") : "";
};

const PokemonProfile = (props) => {
	const { pokemon, species } = props;

	return (
		<Grid container item>
			<Grid item xs={12} sm={6} md={5} lg={6}>
				<Typography variant="body1">Height: {calculateHeight(pokemon.height)} ft.</Typography>
				<Typography variant="body1">Weight: {calculateWeight(pokemon.weight)} lbs.</Typography>
				<Typography variant="body1">Catch Rate: {calculateCaptureRate(species.capture_rate)}%</Typography>
				<Typography variant="body1">Gender Ratio (♀): {calculateFemaleRatio(species.gender_rate)}%</Typography>
			</Grid>
			
			<Grid item xs={12} sm={6} md={7} lg={6}>
				<Typography variant="body1">Abilities: {formatAbilities(pokemon.abilities)}</Typography>
				<Typography variant="body1">Egg Groups: {formatEggGroups(species.egg_groups)}</Typography>
				<Typography variant="body1">Hatch Steps: {calculateHatchSteps(species.hatch_counter)}</Typography>
				<Typography variant="body1">Base Experience: {pokemon.base_experience}</Typography>
			</Grid>
		</Grid>
	);
};

PokemonProfile.propTypes = {
	pokemon: PropTypes.object.isRequired,
	species: PropTypes.object.isRequired
};

export default React.memo(PokemonProfile);