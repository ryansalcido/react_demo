import React, { Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SpotifyHeader from "./SpotifyHeader";
import SpotifyPlaylistView from "./SpotifyPlaylistView";
import SpotifyAlbumView from "./SpotifyAlbumView";
import SpotifyErrorView from "./SpotifyErrorView";
import Spinner from "react-spinkit";
import { SpotifyContext } from "../../Context/SpotifyContext";

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
	const { viewInfo, isLoading, error } = useContext(SpotifyContext);

	let spotifyView;
	if(error) {
		spotifyView = <SpotifyErrorView />;
	} else if(viewInfo && viewInfo.type === "PLAYLIST") {
		spotifyView = <SpotifyPlaylistView />;
	} else if(viewInfo && viewInfo.type === "ALBUM") {
		spotifyView = <SpotifyAlbumView />;
	}
	
	return (
		<Fragment>
			<SpotifyHeader />
			<div className={classes.contentView}>
				{isLoading 
					? <Spinner name="ball-pulse-sync" className={classes.loadingSpinner} fadeIn="none" color="#1DB954" />
					: spotifyView && spotifyView
				}
			</div>
		</Fragment>
	);
};

export default SpotifyContentView;