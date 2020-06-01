import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const SpotifyContext = createContext();

const SpotifyProvider = ({ children }) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ profile, setProfile ] = useState(null);
	const [ playlists, setPlaylists ] = useState(null);
	const [ viewInfo, setViewInfo ] = useLocalStorage("spotifyViewInfo", null);
	const [ error, setError ] = useState(null);

	useEffect(() => {
		let source = axios.CancelToken.source();
		axios.get("/spotify/profile", {cancelToken: source.token}).then(res => {
			const { profile } = res.data;
			setProfile(profile);
		}).catch(error => {
			setProfile(null);
		});

		return () => source.cancel();
	}, []);

	return (
		<SpotifyContext.Provider
			value={{isLoading, setIsLoading, profile, setProfile, 
				playlists, setPlaylists, viewInfo, setViewInfo, error, setError}
			}>
			{ children }
		</SpotifyContext.Provider>
	);
};

SpotifyProvider.propTypes = {
	children: PropTypes.object.isRequired
};

export default SpotifyProvider;