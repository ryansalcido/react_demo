import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Typography from "@material-ui/core/Typography";
import { useWidth, isWidthUp } from "../../hooks/useWidth";
import { SpotifyContext } from "../../Context/SpotifyContext";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2)
	},
	albumListRoot: {
		overflowY: "unset"
	},
	albumTile: {
		cursor: "pointer"
	}
}));

const getGridListCols = (theme, inclusive) => {
	if(isWidthUp(theme, "lg", inclusive)) {
		return 4;
	} else if(isWidthUp(theme, "md", inclusive)) {
		return 3;
	} else if(isWidthUp(theme, "sm", inclusive)) {
		return 2;
	}
	return 1;
};

const SpotifyAlbumView = () => {
	const classes = useStyles();
	const { setIsLoading, setViewInfo, viewInfo: {albums} } = useContext(SpotifyContext);
	const { theme, breakpoint } = useWidth();

	const getTracksByAlbum = (item) => {
		setIsLoading(true);
		const formattedTracks = [];
		item.album.tracks.items.forEach((track) => {
			track.album = { name: item.album.name };
			const temp = { track };
			formattedTracks.push(temp);
		});
		setViewInfo({
			type: "PLAYLIST",
			content: formattedTracks,
			playlist: {
				images: [{url: item.album.images[0].url}],
				name: item.album.name,
				owner: { display_name: item.album.artists[0].name },
				tracks: { total: item.album.tracks.total }
			}
		});
		setIsLoading(false);
	};

	return (
		<div className={classes.root}>
			<Typography variant="h4">Albums</Typography>
			<GridList cols={getGridListCols(theme, breakpoint)} spacing={4} cellHeight={250} classes={{root: classes.albumListRoot}}>
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