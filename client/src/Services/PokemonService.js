export default {
	getPokemon: (pokemonUrl) => {
		return fetch(pokemonUrl)
			.then(res => res.json())
			.then(data => data);
	},
	getPokemonInfo: (pokemonInfoUrl) => {
		return fetch(pokemonInfoUrl)
			.then(res => res.json())
			.then(data => data);
	},
	getPokemonSpecies: (pokemonSpeciesUrl) => {
		return fetch(pokemonSpeciesUrl)
			.then(res => res.json())
			.then(data => data);
	}
};