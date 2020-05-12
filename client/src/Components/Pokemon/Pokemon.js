import React, { useState, useRef, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import useGetPokemon from "../../utils/useGetPokemon";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ScrollTop from "../ScrollTop";
import PokemonCard from "./PokemonCard";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: 10
	},
	pokemonImage: {
		textAlign: "center"
	},
	loadingSpinner: {
		display: "flex",
		justifyContent: "center"
	}
}));

const Pokemon = () => {
	const classes = useStyles();

	const [ currentUrl, setCurrentUrl ] = useState("https://pokeapi.co/api/v2/pokemon");

	const { isLoading, pokemon, nextUrl } = useGetPokemon(currentUrl);

	const observer = useRef();
	const lastBookElementRef = useCallback(node => {
		if(isLoading) {
			return;
		}
		if(observer.current) {
			observer.current.disconnect();
		}
		observer.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && nextUrl !== null) {
				setCurrentUrl(nextUrl);
			}
		});
		if (node) {
			observer.current.observe(node);
		}
	}, [isLoading, nextUrl]);

	return (
		<div className={classes.root}>
			<Grid container spacing={2}>
				{pokemon.map((p, idx) => {
					return (
						<Grid item xs={12} sm={12} md={6} lg={6} key={p.id} ref={pokemon.length === idx + 1 ? lastBookElementRef : null}>
							<PokemonCard pokemon={p} />
						</Grid>
					);
				})}
				<Grid item xs={12} className={classes.loadingSpinner}>
					{isLoading && <CircularProgress color="secondary" />}
				</Grid>
			</Grid>
			<ScrollTop>
				<Fab color="secondary" size="small" aria-label="scroll back to top">
					<KeyboardArrowUpIcon />
				</Fab>
			</ScrollTop>
		</div>
	);
};

export default Pokemon;