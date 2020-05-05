import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExplicitIcon from "@material-ui/icons/Explicit";
import Grid from "@material-ui/core/Grid";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
	rightContentDisplay: {
		height: "calc(100% - 36px)",
		overflowY: "auto"
	},
	trackInfoLayout: {
		display: "flex",
		justifyContent: "space-between",
		width: "100%",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.08)"
		}
	},
	trackItemName: {
		flex: "none",
		width: "90%"
	},
	trackItemPrimary: {
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		overflowX: "hidden"
	},
	trackItemSecondary: {
		display: "flex",
		alignItems: "center",
		"& span": {
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			overflowX: "hidden"
		}
	},
	trackItemDuration: {
		flex: "none",
		width: "10%",
		textAlign: "center"
	},
	playlistImageItem: {
		width: "23%",
		paddingLeft: 16
	},
	defaultPlaylistIcon: {
		width: 200,
		height: 200,
		cursor: "default"
	},
	playlistInfoItem: {
		width: "75%"
	}
}));

const SpotifyPlaylistView = (props) => {
	const classes = useStyles();

	const tracks = useSelector(state => state.tracks);
	const selectedInfo = useSelector(state => state.selectedInfo);

	const formatArtistList = (artists) => {
		var artist = [];
		artists.forEach((item) => {
			artist.push(item.name);
		});
		return artist.join(", ");
	};

	const formatTotalTimePlaylist = () => {
		var totalTimeMins = 0;
		tracks.forEach((item) => {
			totalTimeMins += item.track.duration_ms / 60000;
		});
		const momentTotal = moment.duration({"minutes": totalTimeMins});
		return `${momentTotal.hours()} hr ${momentTotal.minutes()} min ${momentTotal.seconds()} sec`;
	};

	const formatTrackDuration = (ms) => {
		const time = moment.duration(ms);
		return `${time.hours() > 0 ? time.hours() + ":" : ""}${time.minutes()}:${time.seconds() < 10 ? "0" + time.seconds() : time.seconds()}`;
	};

	return (
		<Fragment>
			{selectedInfo !== null &&
				<Fragment>
					<Grid container direction="row">
						<Grid item className={classes.playlistImageItem}>
							{selectedInfo.images.length > 0 ?
								<img src={selectedInfo.images[0].url} width="200" height="200" alt="Playlist" />
								: <MusicNoteIcon className={classes.defaultPlaylistIcon} />
							}
						</Grid>
						<Grid item className={classes.playlistInfoItem}>
							<Typography variant="body1">{selectedInfo.type}</Typography>
							<Typography variant="h3">{selectedInfo.name}</Typography>
							<Typography variant="body1">
								{selectedInfo.owner.display_name} • {selectedInfo.tracks.total} songs • {formatTotalTimePlaylist()}
							</Typography>
						</Grid>
					</Grid>
					<List disablePadding>
						{tracks.map((item) => {
							return (
								<Fragment key={item.track.id}>
									<ListItem dense className={classes.trackInfoLayout}>
										<ListItemText primary={item.track.name}  className={classes.trackItemName}
											classes={{primary: classes.trackItemPrimary, secondary: classes.trackItemSecondary}}
											secondary={
												<Fragment>
													{item.track.explicit === true && <ExplicitIcon />}
													<span>
														• {formatArtistList(item.track.artists)} • {item.track.album.name}
													</span>
												</Fragment>
											}
										/>
										<ListItemText className={classes.trackItemDuration}
											primary={formatTrackDuration(item.track.duration_ms)} />
									</ListItem>
								</Fragment>
							);
						})}
					</List>
				</Fragment>
			}
		</Fragment>
	);
};

export default SpotifyPlaylistView;