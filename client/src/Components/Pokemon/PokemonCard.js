import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import PokemonService from "../../Services/PokemonService";
import PokemonStat from "./PokemonStat";
import { toProperCase } from "../../utils/StringUtils";
import PokemonProfile from "./PokemonProfile";
import { POKEMON_TYPE_COLORS } from "../../constants";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(1),
		minHeight: 346
	},
	pokemonImage: {
		textAlign: "center"
	},
	pokemonTypeChip: {
		margin: "0 5px",
		textTransform: "capitalize"
	},
	defaultPokemonImg: {
		width: 100,
		height: 100
	}
}));

const PokemonCard = (props) => {
	const { pokemon } = props;
	const [ species, setSpecies ] = useState({});
	const [ imgError, setImgError ] = useState(false);

	const classes = useStyles();

	useEffect(() => {
		PokemonService.getPokemonSpecies(pokemon.species.url).then(data => {
			setSpecies(data);
		});
	}, [pokemon.species.url]);

	const formatPokemonName = (name) => {
		let normalized = name;
		if(name.slice(-2) === "-f") {
			normalized = name.replace(/-f$/, "♀");
		} else if(name.slice(-2) === "-m") {
			normalized = name.replace(/-m$/, "♂");
		}
		return toProperCase(normalized);
	};

	const formatPokemonNumber = (number) => {
		if(number < 10) {
			return `00${number}`;
		} else if(number < 100) {
			return `0${number}`;
		} else {
			return number;
		}
	};

	return (
		<Paper elevation={4} className={classes.root}>
			<Grid container item spacing={1}>
				<Grid item xs={10}>
					<Typography variant="h4" align="center">{formatPokemonName(pokemon.name)}</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant="body1" align="center">{`#${formatPokemonNumber(pokemon.id)}`}</Typography>
				</Grid>
			</Grid>
			<Grid container item alignItems="center">
				<Grid item xs={4} className={classes.pokemonImage}>
					{imgError 
						? <HelpOutlineOutlinedIcon className={classes.defaultPokemonImg} />
						: <img src={`https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`}  alt={pokemon.name}
							title={pokemon.name} width="100" height="100" onError={(e) => {setImgError(true);}} />
					}
				</Grid>
				<Grid item xs={8}>
					<Grid item>
						{pokemon.types.map(type => {
							return (
								<Chip size="small" label={type.type.name} key={type.type.name} className={classes.pokemonTypeChip}
									style={{backgroundColor: POKEMON_TYPE_COLORS[type.type.name]}} />
							);
						})}
					</Grid>
					<Grid container item direction="column" >
						<PokemonStat stats={pokemon.stats} />
					</Grid>
				</Grid>
			</Grid>
			<PokemonProfile pokemon={pokemon} species={species} />
		</Paper>
	);
};

PokemonCard.propTypes = {
	pokemon: PropTypes.object.isRequired
};

export default PokemonCard;