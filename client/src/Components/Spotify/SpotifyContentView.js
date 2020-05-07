import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SpotifyHeader from "./SpotifyHeader";
import SpotifyPlaylistView from "./SpotifyPlaylistView";
import SpotifyAlbumView from "./SpotifyAlbumView";
import { useSelector } from "react-redux";
import Spinner from "react-spinkit";

const useStyles = makeStyles((theme) => ({
	contentView: {
		maxHeight: 414,
		overflowY: "auto"
	},
	loadingSpinner: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: 414
	}
}));

const SpotifyContentView = () => {
	const classes = useStyles();
	const albums = useSelector(state => state.albums);
	const isLoading = useSelector(state => state.isLoading);
	const selectedInfo = useSelector(state => state.selectedInfo);

	var spotifyView;
	if(albums.length > 0) {
		spotifyView = <SpotifyAlbumView />;
	} else if(selectedInfo !== null) {
		spotifyView = <SpotifyPlaylistView />;
	}
	
	return (
		<Fragment>
			<SpotifyHeader />
			<div className={classes.contentView}>
				{isLoading 
					? <Spinner name="ball-pulse-sync" className={classes.loadingSpinner} fadeIn="none" color="#1DB954" />
					: spotifyView
				}
			</div>
		</Fragment>
	);
};

export default SpotifyContentView;