import { useState, useEffect } from "react";
import PokemonService from "../../Services/PokemonService";

function useGetPokemon(currentUrl) {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ pokemon, setPokemon ] = useState([]);
	const [ nextUrl, setNextUrl ] = useState(null);

	useEffect(() => {
		let isCanceled = false;
		setIsLoading(true);
		PokemonService.getPokemon(currentUrl).then(data => {
			const { next, results } = data;
			if(!isCanceled) {
				setNextUrl(next);

				Promise.all(results.map(p => PokemonService.getPokemonInfo(p.url).then(info => info)
				)).then(res => {
					if(!isCanceled) {
						setPokemon(prevPokemon => [ ...prevPokemon, ...res ]);
						setIsLoading(false);
					}
				});
			}
		});

		return () => isCanceled = true;
	}, [currentUrl]);

	return { isLoading, pokemon, nextUrl };
}

export default useGetPokemon;