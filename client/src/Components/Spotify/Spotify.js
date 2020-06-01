import React, { Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import SpotifyContainer from "./SpotifyContainer";
import { SpotifyContext } from "../../Context/SpotifyContext";

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
	const { profile } = useContext(SpotifyContext);

	return (
		<Fragment>
			{profile !== null 
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