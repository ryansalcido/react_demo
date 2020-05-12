import { useState, useEffect } from "react";
import PokemonService from "../Services/PokemonService";

function useGetPokemon(currentUrl) {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ pokemon, setPokemon ] = useState([]);
	const [ nextUrl, setNextUrl ] = useState(null);

	useEffect(() => {
		setIsLoading(true);
		PokemonService.getPokemon(currentUrl).then(data => {
			const { next, results } = data;
			setNextUrl(next);

			Promise.all(results.map(p => PokemonService.getPokemonInfo(p.url).then(info => info)
			)).then(res => {
				setPokemon(prevPokemon => [ ...prevPokemon, ...res ]);
				setIsLoading(false);
			});
		});
	}, [currentUrl]);

	return { isLoading, pokemon, nextUrl };
}

export default useGetPokemon;