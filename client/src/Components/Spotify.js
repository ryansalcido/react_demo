import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SpotifyService from "../Services/SpotifyService";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import ExplicitIcon from "@material-ui/icons/Explicit";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import InputBase from "@material-ui/core/InputBase";
import Spinner from "react-spinkit";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
	root: {
		marginLeft: theme.spacing(1)
	},
	spotifyButton: {
		backgroundColor: "#1DB954",
		borderRadius: "100px",
		"&:hover": {
			backgroundColor: "#1DB954"
		}
	},
	spotifyContainer: {
		width: "100%",
		height: "445px",
		padding: 5
	},
	leftInnerContainer: {
		width: "15%",
		height: "100%",
		borderRight: `1px solid ${theme.palette.divider}`
	},
	rightInnerContainer: {
		width: "85%",
		height: "100%"
	},
	spotifyIcon: {
		color: "#1DB954",
		paddingRight: 5
	},
	logo: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
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
	trackItemDuration: {
		flex: "none",
		width: "10%",
		textAlign: "center"
	},
	trackItemPrimary: {
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		overflowX: "hidden"
	},
	playlistImageItem: {
		width: "23%",
		paddingLeft: 16
	},
	playlistInfoItem: {
		width: "75%"
	},
	spotifyHeader: {
		height: 36,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "0 16px"
	},
	spotifyDisplayContent: {
		maxHeight: "calc(100% - 36px)",
		overflowY: "auto"
	},
	defaultPlaylistIcon: {
		width: 200,
		height: 200,
		cursor: "default"
	},
	loadingSpinner: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "calc(100% - 36px)"
	}
}));

const Spotify = () => {
	const SPOTIFY_LOGIN_REDIRECT_URL = process.env.NODE_ENV === "production" 
		? process.env.REACT_APP_SPOTIFY_LOGIN_PROD : process.env.REACT_APP_SPOTIFY_LOGIN_DEV;
	
	const classes = useStyles();
	const [ isSpotifyAuth, setIsSpotifyAuth ] = useState(false);
	const [ profile, setProfile ] = useState({});
	const [ playlists, setPlaylists ] = useState([]);
	const [ tracks, setTracks ] = useState([]);
	const [ selectedPlaylist, setSelectedPlaylist ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(false);

	useEffect(() => {
		SpotifyService.getProfile().then(data => {
			const { profile, message } = data;
			if(message.msgError === false) {
				setIsSpotifyAuth(true);
				setProfile(profile);
				SpotifyService.getPlaylists().then(response => {
					const { playlists, message } = response;
					if(message.msgError === false) {
						setPlaylists(playlists.items);
					}
				});
			} else {
				setIsSpotifyAuth(false);
				setProfile({});
			}
		});
	}, []);

	const getTracksByPlaylist = (playlist) => {
		setIsLoading(true);
		setTracks([]);
		SpotifyService.getTracksByPlaylist(playlist.id).then(data => {
			const { tracks, message } = data;
			if(message.msgError === false) {
				setTracks(tracks);
				setSelectedPlaylist(playlist);
			}
			setIsLoading(false);
		});
	};

	const formatTrackDuration = (ms) => {
		const time = moment.duration(ms);
		return `${time.hours() > 0 ? time.hours() + ":" : ""}${time.minutes()}:${time.seconds() < 10 ? "0" + time.seconds() : time.seconds()}`;
	};

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

	return (
		<Fragment>
			{isSpotifyAuth ? <Fragment>
				<Paper elevation={4}>
					<Grid container direction="row" className={classes.spotifyContainer}>
						<Grid item className={classes.leftInnerContainer}>
							<div className={classes.logo}>
								<FontAwesomeIcon icon={faSpotify} size="2x" className={classes.spotifyIcon} />
								<span>SPOTIFY</span>
							</div>
							<List disablePadding>
								<ListItem button>
									<ListItemIcon><HomeIcon /></ListItemIcon>
									<ListItemText primary="HOME" />
								</ListItem>
								<ListItem button>
									<ListItemIcon><SearchIcon /></ListItemIcon>
									<ListItemText primary="SEARCH" />
								</ListItem>
								<ListItem button divider>
									<ListItemText primary="PLAYLISTS" />
								</ListItem>
								{playlists.map((playlist) => {
									return (
										<Fragment key={playlist.id} >
											<ListItem button dense onClick={() => getTracksByPlaylist(playlist)}>
												<ListItemText primary={playlist.name} />
											</ListItem>
										</Fragment>
									);
								})}
							</List>
						</Grid>
						<Grid item className={classes.rightInnerContainer}>
							<div className={classes.spotifyHeader}>
								<InputBase placeholder="Search..." />
								<Typography variant="body1" align="right">{profile.display_name}</Typography>
							</div>
							
							{isLoading ? <Spinner name="ball-pulse-sync" className={classes.loadingSpinner} fadeIn="none" color="#1DB954" /> 
								: <div className={classes.spotifyDisplayContent}>
									{selectedPlaylist !== null && <Grid container direction="row">
										<Grid item className={classes.playlistImageItem}>
											{selectedPlaylist.images.length > 0 ?
												<img src={selectedPlaylist.images[0].url} width="200" height="200" alt="Playlist" />
												: <MusicNoteIcon className={classes.defaultPlaylistIcon} />
											}
										</Grid>
										<Grid item className={classes.playlistInfoItem}>
											<Typography variant="body1">PLAYLIST</Typography>
											<Typography variant="h3">{selectedPlaylist.name}</Typography>
											<Typography variant="body1">
												Created by: {selectedPlaylist.owner.display_name} • {selectedPlaylist.tracks.total} songs • {formatTotalTimePlaylist()}
											</Typography>
										</Grid>
									</Grid>}

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
								</div>
							}
						</Grid>
					</Grid>
				</Paper>
			</Fragment>
				: <Button href={SPOTIFY_LOGIN_REDIRECT_URL} variant="contained" className={classes.spotifyButton}
					startIcon={<FontAwesomeIcon icon={faSpotify} />}>
					connect with spotify
				</Button>
			}
			
		</Fragment>
	);
};

export default Spotify;