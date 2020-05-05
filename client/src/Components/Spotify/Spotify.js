import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SpotifyService from "../../Services/SpotifyService";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import SpotifyContainer from "./SpotifyContainer";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
	spotifyButton: {
		backgroundColor: "#1DB954",
		borderRadius: "100px",
		"&:hover": {
			backgroundColor: "#1DB954"
		}
	}
}));

const Spotify = () => {
	const SPOTIFY_LOGIN_REDIRECT_URL = process.env.NODE_ENV === "production" 
		? process.env.REACT_APP_SPOTIFY_LOGIN_PROD : process.env.REACT_APP_SPOTIFY_LOGIN_DEV;
	
	const classes = useStyles();
	const [ isSpotifyAuth, setIsSpotifyAuth ] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		SpotifyService.getProfile().then(data => {
			const { profile, message } = data;
			if(message.msgError === false) {
				setIsSpotifyAuth(true);
				dispatch({profile, type: "SET_PROFILE"});
			} else {
				setIsSpotifyAuth(false);
				dispatch({profile: {}, type: "SET_PROFILE"});
			}
		});
	}, [dispatch]);

	return (
		<Fragment>
			{isSpotifyAuth 
				? <SpotifyContainer />
				: <Button href={SPOTIFY_LOGIN_REDIRECT_URL} variant="contained" className={classes.spotifyButton}
					startIcon={<FontAwesomeIcon icon={faSpotify} />}>
					connect with spotify
				</Button>
			}
		</Fragment>
	);
};

export default Spotify;