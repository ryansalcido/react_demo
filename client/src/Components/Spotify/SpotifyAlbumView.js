import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Typography from "@material-ui/core/Typography";
import { useSelector, useDispatch } from "react-redux";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: 12
	},
	albumListRoot: {
		overflowY: "unset"
	},
	albumTile: {
		cursor: "pointer"
	}
}));

const SpotifyAlbumView = (props) => {
	const classes = useStyles();
	const { width } = props;
	const albums = useSelector(state => state.albums);
	const dispatch = useDispatch();

	const getTracksByAlbum = (item) => {
		dispatch({isLoading: true, type: "SET_IS_LOADING"});
		dispatch({albums: [], type: "SET_ALBUMS"});
		const formattedTracks = [];
		item.album.tracks.items.forEach((track) => {
			track.album = { name: item.album.name };
			const temp = { track };
			formattedTracks.push(temp);
		});
		dispatch({tracks: formattedTracks, type: "SET_TRACKS"});
		dispatch({
			selectedInfo: {
				images: [{url: item.album.images[0].url}],
				name: item.album.name,
				type: "ALBUM",
				owner: { display_name: item.album.artists[0].name },
				tracks: { total: item.album.tracks.total }
			},
			type: "SET_SELECTED_INFO"
		});
		dispatch({isLoading: false, type: "SET_IS_LOADING"});
	};

	const getGridListCols = () => {
		if (isWidthUp("lg", width)) {
			return 4;
		}

		if (isWidthUp("md", width)) {
			return 3;
		}

		if (isWidthUp("sm", width)) {
			return 2;
		}

		return 1;
	};

	return (
		<div className={classes.root}>
			<Typography variant="h4">Albums</Typography>
			<GridList cols={getGridListCols()} spacing={4} cellHeight={250} classes={{root: classes.albumListRoot}}>
				{albums.map((item) => (
					<GridListTile key={item.album.id} className={classes.albumTile} onClick={() => getTracksByAlbum(item)}>
						<img src={item.album.images[0].url} alt={item.album.name} />
						<GridListTileBar title={item.album.name} subtitle={item.album.artists[0].name} />
					</GridListTile>
				))}
			</GridList>
		</div>
	);
};

SpotifyAlbumView.propTypes = {
	width: PropTypes.string.isRequired
};

export default withWidth()(SpotifyAlbumView);