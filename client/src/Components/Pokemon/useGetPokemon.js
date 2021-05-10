import { useState, useEffect } from "react";
import axios from "axios";

function useGetPokemon(currentUrl) {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ pokemon, setPokemon ] = useState([]);
	const [ nextUrl, setNextUrl ] = useState(null);

	useEffect(() => {
		let source = axios.CancelToken.source();
		setIsLoading(true);
		axios.get(currentUrl, {cancelToken: source.token}).then(res => {
			const { next, results } = res.data;
			setNextUrl(next);

			Promise.all(
				results.map(p => axios.get(p.url, {cancelToken: source.token}).then(info => info.data)))
				.then(response => {
					setPokemon(prevPokemon => [ ...prevPokemon, ...response ]);
					setIsLoading(false);
				}).catch(err => {
					//Catch axios cancel error
				});
		}).catch(error => {
			//Catch axios cancel error
		});

		return () => source.cancel();
	}, [currentUrl]);

	return { isLoading, pokemon, nextUrl };
}

export default useGetPokemon;