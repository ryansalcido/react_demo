import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Typography from "@material-ui/core/Typography";
import { useSelector, useDispatch } from "react-redux";

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

const SpotifyAlbumView = () => {
	const classes = useStyles();
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

	return (
		<div className={classes.root}>
			<Typography variant="h4">Albums</Typography>
			<GridList cols={4} spacing={16} cellHeight={250} classes={{root: classes.albumListRoot}}>
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

export default SpotifyAlbumView;