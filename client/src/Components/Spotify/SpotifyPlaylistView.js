import React, { Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import ListItemText from "@material-ui/core/ListItemText";
import ExplicitIcon from "@material-ui/icons/Explicit";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import { SpotifyContext } from "../../Context/SpotifyContext";

const useStyles = makeStyles((theme) => ({
	playlistViewRoot: {
		padding: theme.spacing(2)
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
	defaultMusicIcon: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: 200,
		height: 200,
		backgroundColor: "#282828",
		color: "#7f7f7f"
	}
}));

const formatArtistList = (artists) => {
	var artist = [];
	artists.forEach((item) => {
		artist.push(item.name);
	});
	return artist.join(", ");
};

const formatTotalTimePlaylist = (tracks) => {
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

const SpotifyPlaylistView = () => {
	const classes = useStyles();
	const { viewInfo: {type, content, playlist} } = useContext(SpotifyContext);

	return (
		<div className={classes.playlistViewRoot}>
			{type && content && playlist && (
				<Grid container spacing={1} alignItems="center">
					{playlist.images.length > 0 
						? <Grid item xs={12} md={4} lg={3}>
							<img src={playlist.images[0].url} width="200" height="200" alt="Playlist" />
						</Grid>
						: <Grid item xs={12} md={4} lg={3} className={classes.defaultMusicIcon}>
							<FontAwesomeIcon icon={faMusic} size="4x"/>
						</Grid>
					}
					<Grid item xs={12} md={8} lg={9}>
						<Typography variant="body1">{type}</Typography>
						<Typography variant="h3">{playlist.name}</Typography>
						<Grid item xs={12}>
							<Typography variant="body1">{playlist.owner.display_name}</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1">{playlist.tracks.total} songs • {formatTotalTimePlaylist(content)}</Typography>
						</Grid>
					</Grid>
					{content.map((item) => {
						return (
							<Fragment key={item.track.id}>
								<Grid item xs={10} md={11}>
									<ListItemText primary={item.track.name}  className={classes.trackItemName}
										classes={{primary: classes.trackItemPrimary, secondary: classes.trackItemSecondary}}
										secondary={
											<Fragment>
												{item.track.explicit === true && <ExplicitIcon />}
												<span>
													• {formatArtistList(item.track.artists)} • {item.track.album.name}
												</span>
											</Fragment>
										} />
								</Grid>
								<Grid item xs={2} md={1}>
									<Typography variant="body2">{formatTrackDuration(item.track.duration_ms)}</Typography>
								</Grid>
							</Fragment>
						);
					})}
				</Grid>	
			)}
		</div>
	);
};

export default SpotifyPlaylistView;